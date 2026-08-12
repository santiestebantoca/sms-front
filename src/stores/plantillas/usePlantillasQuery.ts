import { useQuery, defineQuery } from '@pinia/colada'
import { plantillasApi as api } from '@/api/plantillas'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export const usePlantillasQuery = () => {
  const search = ref('')

  const { data, isLoading } = useQuery({
    key: () => queryKeys.plantillas.lista({ search: search.value }),
    query: () => api.getAll({ search: search.value }),
  })

  return {
    plantillas: data,
    isLoading,
    search
  }
}

export const useWidgetPlantillasQuery = () => {
  const search = ref('')

  const { data, isLoading } = useQuery({
    key: () => [...queryKeys.plantillas.lista({ search: search.value }), 'widget'],
    query: () => api.getAll({ search: search.value }),
    enabled: () => search.value?.length >= 2,
  })

  return {
    plantillas: data,
    isLoading,
    search
  }
}