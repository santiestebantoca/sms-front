// api/users.js
import { api } from './client'

export const usersApi = {
  // Colección
  getAll: (params) => api.get('/config_user/users', { params }).then(res => res.data),
  create: (data) => api.post('/config_user/users', data).then(res => w2p(res.data)),
  delete: (id) => api.delete(`/config_user/users/${id}`).then(res => res.data),

  // Item individual
  getById: (id) => api.get(`/config_user/users/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/config_user/users/${id}`, data).then(res => w2p(res.data)),

  // Relacionados
  membership: (params) => api.post('/config_user/membership', params).then(res => w2p(res.data)),
  authgroup: () => api.get('/config_user/authgroup').then(res => res.data),
}