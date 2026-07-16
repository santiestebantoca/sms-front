// api/notificados.js
import { api } from './client'

export const notificadosApi = {
  // Colección
  getAll: (params) => api.get('/notificados/notificados', { params }).then(res => res.data),
  update: (id, data) => api.put(`/notificados/notificados/${id}`, data).then(res => res.data),
}