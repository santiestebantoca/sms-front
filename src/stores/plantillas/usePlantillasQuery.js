import { useQuery, defineQuery } from '@pinia/colada'
import { useDebounce } from '@vueuse/core'
import { plantillasApi as api } from '@/api/plantillas'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export const usePlantillasQuery = () => {
  const search = ref('')
  const debounced = useDebounce(search, 600) // 300 más común
  const filter = computed(() => ({ search: debounced.value }))
  const { data, isLoading } = useQuery({
    key: () => queryKeys.plantillas.lista(filter.value),
    query: () => api.getAll(filter.value),
  })

  return {
    plantillas: data,
    isLoading,
    search
  }
}

export const useWidgetPlantillasQuery = () => {
  const search = ref('')
  const debounced = useDebounce(search, 600) // 300 más común
  const filter = computed(() => ({ search: debounced.value }))
  const { data, isLoading } = useQuery({
    key: () => [...queryKeys.plantillas.lista(filter.value), 'widget'],
    query: () => api.getAll(filter.value),
    enabled: () => debounced.value?.length >= 2,
  })

  return {
    plantillas: data,
    isLoading,
    search
  }
}