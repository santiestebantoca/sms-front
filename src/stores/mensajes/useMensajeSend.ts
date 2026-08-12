import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { mensajesApi as api } from '@/api/mensajes'

export function useMensajeSend() {
  const queryCache = useQueryCache()

  return useMutation<any, Record<string, any>>({
    mutation: (newData: Record<string, any>) => api.send(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.notificaciones.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.notificaciones.listas() })
    }
  })
}