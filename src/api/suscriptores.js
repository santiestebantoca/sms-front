import { api } from './client'

export const suscriptoresApi = {
  getAll: (params) => api.get('/suscriptores/suscriptores', { params }).then(res => res.data),
  create: (data) => api.post('/suscriptores/suscriptores', data).then(res => res.data),
  delete: (id) => api.delete(`/suscriptores/suscriptores/${id}`).then(res => res.data),
  getById: (id) => api.get(`/suscriptores/suscriptores/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/suscriptores/suscriptores/${id}`, data).then(res => res.data),
}