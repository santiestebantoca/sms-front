import { useMutation, useQueryCache } from '@pinia/colada'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { queryKeys } from '@/lib/query-keys'
import { patch, remove } from '@/utils'

//
// Queries: listas, detalle y detalle del grupo expandido que lo contiene
//
export function useSuscriptorDelete() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (suscriptorId) => api.delete(suscriptorId),

    onMutate: async () => {
      await Promise.all([
        queryCache.cancelQueries({ key: queryKeys.suscriptores.listas() }),
        queryCache.cancelQueries({ key: queryKeys.suscriptores.detalles() }),
      ])
    },

    onSuccess: async (data, variables, context) => {
      queryCache.invalidateQueries({ key: queryKeys.suscriptores.listas() })
    }
  })
}