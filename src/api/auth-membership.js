import { api } from './client'

export const authMembershipApi = {
  getAll: (params) => api.get('/auth_membership/auth_membership', { params }).then(res => res.data),
  update: (id, data) => api.put(`/auth_membership/auth_membership/${id}`, data).then(res => res.data),
}