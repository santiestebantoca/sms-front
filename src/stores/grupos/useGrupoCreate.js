import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'

export function useGrupoCreate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (newData) => api.create(newData),

    onMutate: async () => {
      await Promise.all([
        queryCache.cancelQueries({ key: queryKeys.grupos.listas() }),
        queryCache.cancelQueries({ key: queryKeys.grupos.detalles() })
      ])
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
      // Caso especial: actualiza el padre si se crea un grupo hijo
      queryCache.invalidateQueries({ key: queryKeys.grupos.detalles() })
    }
  })
}