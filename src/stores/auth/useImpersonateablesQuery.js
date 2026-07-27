// stores/authImpersonateUsers.js
// import { ref, computed, watch } from 'vue'
// import { defineStore } from 'pinia'
// import { authApi } from '@/api/auth'

// export const useAuthImpersonateUserOptionsStore = defineStore('auth-impersonate-user-options', () => {
//   const data_ = ref([])
//   const filterBy = ref({})

//   watch(filterBy, (val) => {
//     if (isFiltered.value) get(val)
//   }, { deep: true })

//   const data = computed(() => isFiltered.value ? data_.value : null)
//   const isFiltered = computed(() => Boolean(Object.keys(filterBy.value || {}).length))

//   const get = async (params) => {
//     const users = await authApi.getUsersForImpersonate(params)
//     data_.value = users
//   }

//   return { data, filterBy, isFiltered }
// })

import { useQuery, defineQuery } from '@pinia/colada'
import { useDebounce } from '@vueuse/core'
import { authApi as api } from '@/api/auth'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'

export const useImpersonateablesQuery = defineQuery(() => {
  const { authUser } = useAuthStore()
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
    actual: d.id === authUser.id
  })))

  return {
    users,
    isLoading,
    search,
    isFiltered
  }
})