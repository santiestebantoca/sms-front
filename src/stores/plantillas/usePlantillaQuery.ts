import { useQuery } from '@pinia/colada'
import { plantillasApi as api } from '@/api/plantillas'
import { queryKeys } from '@/lib/query-keys'
import { toValue, Ref } from 'vue'

export function usePlantillaQuery(plantillaId?: number | string | Ref) {
  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.plantillas.detalle(toValue(plantillaId)),
    query: () => api.getById(toValue(plantillaId)),
    enabled: () => !!toValue(plantillaId),
  })

  return {
    plantilla: data,
    isLoading,
    isPending
  }
}