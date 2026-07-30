import { useMutation, useQueryCache } from '@pinia/colada'
import { gruposApi as api } from '@/api/grupos'
import { queryKeys } from '@/lib/query-keys'

export function useGrupoDelete() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (deletedId) => api.delete(deletedId),

    onMutate: async () => {
      await Promise.all([
        queryCache.cancelQueries({ key: queryKeys.grupos.listas() }),
        queryCache.cancelQueries({ key: queryKeys.grupos.detalles() }),
      ])
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
      // Caso especial: actualiza el padre si se elimina un grupo hijo
      queryCache.invalidateQueries({ key: queryKeys.grupos.detalles() })
    }
  })
}