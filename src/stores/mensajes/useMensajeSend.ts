import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { mensajesApi as api } from '@/api/mensajes'
import type { MensajePayload } from '@/types/models'

export function useMensajeSend() {
  const queryCache = useQueryCache()

  return useMutation<any, MensajePayload>({
    mutation: (newData) => api.send(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.notificaciones.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.notificaciones.listas() })
    }
  })
}