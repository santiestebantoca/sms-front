// stores/auth/index.js
import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const authUser = ref(null)
  const auth = ref(null) // Important to manage page reload on navigation guard

  watch(authUser, value => auth.value = !!authUser.value)

  const login = async (credentials) => {
    const userData = await authApi.login(credentials)
    authUser.value = userData  // Object or null
    return userData
  }

  const logout = async () => {
    await authApi.logout()
    authUser.value = null
  }

  const getAuthUser = async () => {
    const userData = await authApi.getCurrentUser()
    authUser.value = userData
    return userData
  }

  const setAuthUser = (data) => authUser.value = data

  return {
    auth,
    authUser,
    login,
    logout,
    getAuthUser,
    setAuthUser
  }
})