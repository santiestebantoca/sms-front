import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { plantillasApi as api } from '@/api/plantillas'
import type { PlantillaCreate } from '@/types/models'

export function usePlantillaCreate() {
  const queryCache = useQueryCache()

  return useMutation<any, PlantillaCreate>({
    mutation: (newData) => api.create(newData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.plantillas.listas() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.plantillas.listas() })
    }
  })
}