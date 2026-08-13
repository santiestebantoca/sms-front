import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'
import type { SuscriptorCreate } from '@/types/models'

export function useSuscriptorCreate() {
  const queryCache = useQueryCache()

  return useMutation<any, SuscriptorCreate>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.suscriptores.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.suscriptores.listas() })
    }
  })
}