// api/client.js
import axios from 'axios'
import {
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ServerError,
  ApiError
} from './errors'
import mitt from 'mitt'
import { shallowRef } from 'vue'

export const events = mitt()

const notify = (type, message) => events.emit('error', { message, type })

// Referencias que se inyectarán después de crear la app Vue
let router = null

// Inicializa las dependencias del interceptor.
export const initAxiosInterceptors = (deps) => {
  router = deps.router
}

export const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 120000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Estado reactivo // shallowRef es más eficiente para objetos Date
const lastServerAccess = shallowRef(new Date())

export const getLastServerAccess = () => lastServerAccess

const touchLastServerAccess = () => lastServerAccess.value = new Date()

// Interceptor de respuesta
api.interceptors.response.use(
  response => {
    touchLastServerAccess()
    // En alguna condición se pudiera lanzar un error personalizado aquí
    // console.log(response)
    return response
  },
  error => {
    // Webb2py con raise HTTP(code, mensaje, **headers)
    // Siempre pone content-type: text/html, y pone un mensaje por defecto
    // No pone los headers para CORS en los mensajes de errores lanzados por su cuenta
    if (axios.isCancel(error)) throw error // Ya no importa
    if (error instanceof ApiError) throw error; // Ya es error personalizado lanzado en "success"

    // Sin respuesta del servidor (error de conectividad o servidor no responde)
    // Webb2py no pone baceras CORS en status 500, luego el navegador invalida response 
    if (!error.response) {
      notify('network', 'Sin conexión a internet o el servidor no responde o falla.')
      throw new NetworkError('Sin conexión o servidor inaccesible.', error)
    }

    const { status, data, headers, config } = error.response
    const isHtml = headers['content-type']?.includes('text/html') ||
      (typeof data === 'string' && data.trim().startsWith('<'))

    let message = config?.url ? `Error en ${config.url}` : 'Error del servidor'
    if (!isHtml && data?.message) message = data.message
    else if (isHtml) message = 'El servidor devolvió HTML en lugar de JSON.'

    switch (status) {
      case 401: // Unauthorized - Sesión expirada o no autenticado
        try {
          router.push({
            name: 'auth-login',
            query: { next: router.currentRoute.value.fullPath }
          })
        } catch (e) {
          // Fallback si la store no está lista
          // window.location.href = '/login'
        }
        notify('client', 'Tu sesión ha expirado. Inicia sesión nuevamente.')
        throw new AuthenticationError(message, error)
        break

      case 403: // Forbidden
        notify('client', 'No tienes permisos para realizar esta acción.')
        throw new AuthorizationError(message, error)
        break

      case 404: // Not Found
        notify('client', 'El recurso solicitado no existe.')
        throw new NotFoundError(message, error)
        break

      case 422: // Validation Error - web2py no lo hace así por defecto
        // notify('client', 'Datos inválidos. Por favor verifica la información.')
        throw new ValidationError(message, data, error)
        break

      case 500:
      case 502:
      case 503:
      case 504:
        notify('server', 'Error en el servidor. Intenta nuevamente más tarde.')
        throw new ServerError('Error interno del servidor. Revisa los tickets de soporte.', error)
        break

      default:
        // Error de red o desconocido
        if (error.code === 'ECONNABORTED') {
          notify('network', 'Tiempo de espera agotado. Verifica tu conexión.')
        } else if (error.message === 'Network Error') {
          notify('network', 'Error de conexión. Verifica tu conexión.')
        } else {
          notify('unknown', 'Ocurrió un error inesperado.')
        }
        throw new ApiError(message, status, data, error)
    }
  }
)