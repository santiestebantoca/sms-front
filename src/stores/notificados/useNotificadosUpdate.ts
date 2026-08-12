import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notificadosApi as api } from '@/api/notificados'

export function useNotificadosUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, any>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.notificados.listas() })
      queryCache.cancelQueries({ key: queryKeys.notificados.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.notificados.listas() })
      queryCache.invalidateQueries({ key: queryKeys.notificados.detalles() })
    }
  })
}