import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { plantillasApi as api } from '@/api/plantillas'
import type { PlantillaUpdate } from '@/types/models'

export function usePlantillaUpdate() {
  const queryCache = useQueryCache()

  return useMutation<any, PlantillaUpdate>({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: () => {
      queryCache.cancelQueries({ key: queryKeys.plantillas.listas() })
      queryCache.cancelQueries({ key: queryKeys.plantillas.detalles() })
    },

    onSuccess: () => {
      queryCache.invalidateQueries({ key: queryKeys.plantillas.listas() })
      queryCache.invalidateQueries({ key: queryKeys.plantillas.detalles() })
    }
  })
}