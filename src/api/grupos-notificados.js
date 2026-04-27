// api/notificados.js
import { api } from './client'

export const notificadosApi = {
  // Colección
  getAll: (params) => api.get('/notificados/notificados', { params }).then(res => res.data),
  create: (data) => api.post('/notificados/notificados', data).then(res => res.data),
}