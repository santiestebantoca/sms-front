// api/notificados.js
import { api } from './client'

export const notificadosApi = {
  getAll: (params) => api.get('/notificados/notificados', { params }).then(res => res.data),
}