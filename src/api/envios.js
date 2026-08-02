import { api } from './client'

export const enviosApi = {
  getAll: (params) => api.get('/envios/envios', { params }).then(res => res.data.map((d) => ({
    id: d.suscriptor_id,
    nombre: d.suscriptor,
    grupo: d.grupo
  }))),
}