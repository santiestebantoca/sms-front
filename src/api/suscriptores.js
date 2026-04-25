// api/suscriptores.js
import { api } from './client'

export const suscriptoresApi = {
  // Colección
  getAll: (params) => api.get('/config_suscriptor/suscriptores', { params }).then(res => res.data),
  create: (data) => api.post('/config_suscriptor/suscriptores', data).then(res => w2p(res.data)),
  delete: (id) => api.delete(`/config_suscriptor/suscriptores/${id}`).then(res => res.data),

  // Item individual
  getById: (id) => api.get(`/config_suscriptor/suscriptores/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/config_suscriptor/suscriptores/${id}`, data).then(res => w2p(res.data)),
}