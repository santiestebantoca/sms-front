import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notificadosApi as api } from '@/api/notificados'

export function useNotificadosUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: async () => {
      await Promise.all([
        // En el futuro serán solo las dos primeras líneas
        // queryCache.cancelQueries({ key: queryKeys.notificados.listas() }),
        // queryCache.cancelQueries({ key: queryKeys.notificados.detallas() }),
        queryCache.cancelQueries({ key: queryKeys.grupos.detalles() }),
      ])
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
      // Caso especial: actualiza el grupo si se actualizan sus notificados
      queryCache.invalidateQueries({ key: queryKeys.grupos.detalles() })
    }
  })
}