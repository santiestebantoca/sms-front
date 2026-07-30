import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'

export function useGrupoUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: async () => {
      await Promise.all([
        queryCache.cancelQueries({ key: queryKeys.grupos.listas() }),
        queryCache.cancelQueries({ key: queryKeys.grupos.detalles() }),
      ])
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
      queryCache.invalidateQueries({ key: queryKeys.grupos.detalles() })
    }
  })
}