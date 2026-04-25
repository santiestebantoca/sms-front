// api/plantillas.js
import { api } from './client'

export const plantillasApi = {
  // Colección
  getAll: (params) => api.get('/plantillas/plantillas', { params }).then(res => res.data),
  create: (data) => api.post('/plantillas/plantillas', data).then(res => res.data),

  // Item individual
  // getById: (id) => api.get(`/config_plantilla/plantillas/${id}`).then(res => res.data),
  // update: (id, data) => api.put(`/config_plantilla/plantillas/${id}`, data).then(res => w2p(res.data)),
  // delete: (id) => api.delete(`/config_plantilla/plantillas/${id}`).then(res => res.data),
}