import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { usuariosApi as api } from '@/api/usuarios'

export function useUsuarioUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, { id: number | string } & Record<string, any>>({
    mutation: ({ id, ...updatedData }: { id: number | string } & Record<string, any>) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.usuarios.listas() })
      queryCache.cancelQueries({ key: queryKeys.usuarios.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.usuarios.listas() })
      queryCache.invalidateQueries({ key: queryKeys.usuarios.detalles() })
    }
  })
}