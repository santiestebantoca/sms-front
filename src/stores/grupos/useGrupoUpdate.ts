import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'

export function useGrupoUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, { id: number | string } & Record<string, any>>({
    mutation: ({ id, ...updatedData }: { id: number | string } & Record<string, any>) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.grupos.listas() })
      queryCache.cancelQueries({ key: queryKeys.grupos.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
      queryCache.invalidateQueries({ key: queryKeys.grupos.detalles() })
    }
  })
}