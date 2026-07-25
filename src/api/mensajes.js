// api/mensajes.js
import { api } from './client'

export const mensajesApi = {
    // Collection
    notificaciones: () => api.get('/mensajes/notificaciones').then(res => res.data),
    getAll: (params) => api.get('/mensajes/mensajes', { params }).then(res => res.data.map(d => ({
        ...d,
        subgrupo: d.subgrupo || d.id
    }))),

    // Item
    getById: (id, params) => api.get(`/mensajes/mensajes/${id}`, { params }).then(res => res.data),
    update: (id, data) => api.put(`/mensajes/mensajes/${id}`, data).then(res => res.data),
    send: (data) => api.post('/mensajes/mensajes', data).then(res => res.data),
}