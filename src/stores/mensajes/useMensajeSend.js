import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { mensajesApi as api } from '@/api/mensajes'

export function useMensajeSend() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (newData) => api.send(newData),

    onMutate: async () => {
      await Promise.all([
        // Caso en que se muestre una lista de enviados
        // queryCache.cancelQueries({ key: queryKeys.mensajes.listas() }),
        queryCache.cancelQueries({ key: queryKeys.mensajes.notificaciones() })
      ])
    },

    onSuccess: () => {
      // Caso en que se muestre una lista de enviados
      // queryCache.invalidateQueries({ key: queryKeys.mensajes.listas() })
      queryCache.invalidateQueries({ key: queryKeys.mensajes.notificaciones() })
    }
  })
}