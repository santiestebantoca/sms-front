import { api } from './client'

export const mensajesApi = {
    notificaciones: () => api.get('/mensajes/notificaciones').then(res => res.data),
    getAll: (params = {}) => api.get('/mensajes/mensajes', { params }).then(res => res.data),
    getById: (id) => api.get(`/mensajes/mensajes/${id}`).then(res => res.data),
    update: (id, data) => api.put(`/mensajes/mensajes/${id}`, data).then(res => res.data),
    send: (data) => api.post('/mensajes/mensajes', data).then(res => res.data),
}
