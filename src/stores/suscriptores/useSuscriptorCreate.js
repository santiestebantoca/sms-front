import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'

export function useSuscriptorCreate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (newData) => api.create(newData),

    onMutate: async () => {
      await queryCache.cancelQueries({ key: queryKeys.suscriptores.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.suscriptores.listas() })
    }
  })
}