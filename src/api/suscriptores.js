// api/suscriptores.js
import { api } from './client'

export const suscriptoresApi = {
  // Colección
  // getAll: (params) => api.get('/config_suscriptor/suscriptores', { params }).then(res => res.data),
  create: (data) => api.post('/suscriptores/suscriptores', data).then(res => res.data),
  delete: (id) => api.delete(`/suscriptores/suscriptores/${id}`).then(res => res.data),

  // Item individual
  // getById: (id) => api.get(`/config_suscriptor/suscriptores/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/suscriptores/suscriptores/${id}`, data).then(res => res.data),
}