// api/componer.js
import { api } from './client'

export const smssApi = {
  // Colección
  meta: (params) => api.get('/smss/meta', { params }).then(res => res.data),
  getAll: (params) => api.get('/smss/mensajes', { params }).then(res => res.data.map(d => ({
    ...d,
    subgrupo: d.subgrupo || d.id
  }))),

  // Item individual
  getById: (id, params) => api.get(`/smss/mensajes/${id}`, { params }).then(res => res.data),
  update: (id, data) => api.put(`/smss/mensajes/${id}`, data).then(res => res.data),
  send: (data) => api.post('/smss/mensajes', data).then(res => res.data),
}