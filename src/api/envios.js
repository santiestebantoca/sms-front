// api/componer.js
import { api } from './client'

export const enviosApi = {
  getAll: (params) => api.get('/envios/envios', { params }).then(res => res.data),
}