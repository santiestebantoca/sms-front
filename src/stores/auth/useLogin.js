// stores/authImpersonate.js
import { useMutation, useQueryCache } from '@pinia/colada'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'

export function useLogin() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (credentials) => api.login(credentials),

    onSuccess: (data, variables, context) => {
      queryCache.setQueryData(() => queryKeys.auth.user(), () => data)
    }
  })
}