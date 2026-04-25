// api/grupos.js
import { api } from './client'

export const gruposApi = {
  // Colección
  getAll: (params) => api.get('/grupos/grupos', { params }).then(res => res.data),
  create: (data) => api.post('/grupos/grupos', data).then(res => res.data),
  delete: (id) => api.delete(`/grupos/grupos/${id}`).then(res => res.data),

  // Item individual
  getById: (id, params) => api.get(`/grupos/grupos/${id}`, { params }).then(res => res.data),
  update: (id, data) => api.put(`/grupos/grupos/${id}`, data).then(res => res.data),
}
