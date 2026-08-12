import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'

export function useSuscriptorDelete() {
  const queryCache = useQueryCache()

  return useMutation<any, any>({
    mutation: (deletedId) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.suscriptores.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.suscriptores.listas() })
    }
  })
}