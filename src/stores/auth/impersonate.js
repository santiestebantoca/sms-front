// stores/authImpersonate.js
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import { useAuthStore } from './index'

export const useAuthImpersonateStore = defineStore('auth-impersonate', () => {
  const auth = useAuthStore()

  const post = (userId = 0) => {
    authApi.impersonate(userId)
      .then(res => auth.setAuthUser(res))
  }

  return { post }
})