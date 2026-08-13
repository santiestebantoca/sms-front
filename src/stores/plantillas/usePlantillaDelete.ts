import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { plantillasApi as api } from '@/api/plantillas'

export function usePlantillaDelete() {
  const queryCache = useQueryCache()

  return useMutation<any, number | string>({
    mutation: (deletedId) => api.delete(deletedId),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.plantillas.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.plantillas.listas() })
    }
  })
}