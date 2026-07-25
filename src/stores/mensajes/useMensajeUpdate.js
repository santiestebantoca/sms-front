import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { mensajesApi as api } from '@/api/mensajes'
import { patch, remove, satisfies } from '@/utils'

//
// Queries: lista
//
export function useMensajeUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: async ({ id, ...updatedData }) => {
      const keyListas = queryKeys.mensajes.listas()

      await queryCache.cancelQueries({ key: keyListas })

      return {
        keyListas,
      }
    },

    onSuccess: (remoteData, mutationData, context) => {
      queryCache.invalidateQueries({ key: context.keyListas })
    }
  })
}