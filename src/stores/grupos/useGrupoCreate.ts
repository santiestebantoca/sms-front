import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'

export function useGrupoCreate() {
  const queryCache = useQueryCache()

  return useMutation<any, Record<string, any>>({
    mutation: (newData: Record<string, any>) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.grupos.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.grupos.listas() })
    }
  })
}