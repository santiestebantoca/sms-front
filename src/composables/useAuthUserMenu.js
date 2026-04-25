import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

export default function useAuthUserMenu() {
  const user = computed(() => useAuthStore().authUser)

  const actions = computed(() => {
    const res = [
      {
        title: 'Cerrar sesión',
        path: { name: 'auth-logout' },
        icon: 'bi-box-arrow-right'
      },]
    if (user.value?.can_impersonate || user.value?.is_impersonating)
      res.push({
        title: 'Personificar',
        path: { name: 'auth-impersonate' },
        icon: 'bi-people'
      })
    return res
  })
  const isImpersonating = computed(() => user.value.is_impersonating)

  return { user, actions, isImpersonating }
}
