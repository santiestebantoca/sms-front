import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { plantillasApi as api } from '@/api/plantillas'

export function usePlantillaCreate() {
  const queryCache = useQueryCache()

  return useMutation<any, Record<string, any>>({
    mutation: (newData: Record<string, any>) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.plantillas.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.plantillas.listas() })
    }
  })
}