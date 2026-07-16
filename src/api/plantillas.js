import { api } from './client'

export const plantillasApi = {
  // Colección
  getAll: (params) => api.get('/plantillas/plantillas', { params }).then(res => res.data),
  create: (data) => api.post('/plantillas/plantillas', data).then(res => res.data),
  delete: (id) => api.delete(`/plantillas/plantillas/${id}`).then(res => res.data),

  // Item individual
  getById: (id) => api.get(`/plantillas/plantillas/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/plantillas/plantillas/${id}`, data).then(res => res.data),
}