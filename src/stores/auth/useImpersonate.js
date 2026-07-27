// stores/authImpersonate.js
import { useMutation } from '@pinia/colada'
import { authApi as api } from '@/api/auth'

export function useImpersonate() {

  return useMutation({
    mutation: (userId = 0) => api.impersonate(userId),

    onSuccess: (data, variables, context) => {
      window.location.reload()
    }
  })
}