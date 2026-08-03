import { useQuery, defineQuery } from '@pinia/colada'
import { useDebounce } from '@vueuse/core'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'
import { useAuthQuery } from '@/stores/auth'
import { ref, computed } from 'vue'

export const useImpersonateQuery = defineQuery(() => {
  const { authUser } = useAuthQuery()
  const search = ref('')
  const debounced = useDebounce(search, 600)
  const filter = computed(() => ({ search: debounced.value }))
  const isFiltered = computed(() => debounced.value?.length >= 2)

  const { data, isLoading } = useQuery({
    key: () => [...queryKeys.users.lista(filter.value)],
    query: () => api.getImpersonateables(filter.value),
    enabled: () => debounced.value?.length >= 2,
  })

  const users = computed(() => data.value?.map(d => ({
    ...d,
    actual: d.id === authUser.value.id
  })))

  return {
    users,
    isLoading,
    search,
    isFiltered
  }
})