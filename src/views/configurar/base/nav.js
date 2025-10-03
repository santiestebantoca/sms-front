import useAuthStore from '@/stores/auth'
import { computed } from 'vue'

export default function useNavOptions() {
  const admin = useAuthStore().authUser.admin
  const options = computed(() => [
    {
      to: { name: 'configurar-grupos' },
      icon: 'subtract',
      label: 'Grupos',
      name: 'grupos'
    },
    {
      to: { name: 'configurar-suscriptores' },
      icon: 'people-fill',
      label: 'Suscriptores',
      name: 'suscriptores'
    },
    ...admin ? [{
      to: { name: 'configurar-users' },
      icon: 'person-workspace',
      label: 'Usuarios',
      name: 'users'
    }] : [],
    {
      to: { name: 'configurar-plantillas' },
      icon: 'card-text',
      label: 'Plantillas',
      name: 'plantillas'
    }
  ])
  return { options }
}
