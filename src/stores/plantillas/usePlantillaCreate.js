import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { plantillasApi as api } from '@/api/plantillas'

export function usePlantillaCreate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (newData) => api.create(newData),

    onMutate: async () => {
      await queryCache.cancelQueries({ key: queryKeys.plantillas.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.plantillas.listas() })
    }
  })
}