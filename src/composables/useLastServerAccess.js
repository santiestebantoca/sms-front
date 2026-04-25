// composables/useLastServerAccess.js
import { getLastServerAccess } from '@/api/client'
import { computed } from 'vue'

// Para mantener la misma interfaz que tenías con useHttpStore
export const useLastServerAccess = () => {
  const lastServerAccess = getLastServerAccess()

  return {
    // Mantenemos la misma propiedad para que el watch siga funcionando
    lastServerAccess: computed(() => lastServerAccess.value)
  }
}