import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { mensajesApi as api } from '@/api/mensajes'

export function useMensajeUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.mensajes.listas() })
      queryCache.cancelQueries({ key: queryKeys.mensajes.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.mensajes.listas() })
      queryCache.invalidateQueries({ key: queryKeys.mensajes.detalles() })
    }
  })
}