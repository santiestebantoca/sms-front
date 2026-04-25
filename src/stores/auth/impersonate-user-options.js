// stores/authImpersonateUsers.js
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'

export const useAuthImpersonateUserOptionsStore = defineStore('auth-impersonate-user-options', () => {
  const data_ = ref([])
  const filterBy = ref({})

  watch(filterBy, (val) => {
    if (isFiltered.value) get(val)
  }, { deep: true })

  const data = computed(() => isFiltered.value ? data_.value : null)
  const isFiltered = computed(() => Boolean(Object.keys(filterBy.value || {}).length))

  const get = (params) => authApi.getUsersForImpersonate(params)

  return { data, filterBy, isFiltered, get }
})