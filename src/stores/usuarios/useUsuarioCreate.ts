import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'

export function useUsuarioCreate() {
  const queryCache = useQueryCache()

  return useMutation<any, Record<string, any>>({
    mutation: (newData: Record<string, any>) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.usuarios.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.usuarios.listas() })
    }
  })
}