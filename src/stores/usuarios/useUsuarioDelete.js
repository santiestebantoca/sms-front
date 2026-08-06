import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'

export function useUsuarioDelete() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (deletedId) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.usuarios.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.usuarios.listas() })
    }
  })
}