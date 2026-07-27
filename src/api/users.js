import { api } from './client'

export const usersApi = {
  getAll: (params) => api.get('/users/users', { params }).then(res => res.data),
  create: (data) => api.post('/users/users', data).then(res => res.data),
  delete: (id) => api.delete(`/users/users/${id}`).then(res => res.data),
  getById: (id) => api.get(`/users/users/${id}`).then(res => res.data),
  update: (id, data) => api.put(`/users/users/${id}`, data).then(res => res.data),
  membership: (params) => api.post('/users/membership', params).then(res => res.data),
  authgroup: () => api.get('/users/authgroup').then(res => res.data),
}