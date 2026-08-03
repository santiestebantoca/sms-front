import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'

export function useSuscriptorUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.suscriptores.listas() })
      queryCache.cancelQueries({ key: queryKeys.suscriptores.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.suscriptores.listas() })
      queryCache.invalidateQueries({ key: queryKeys.suscriptores.detalles() })
    }
  })
}