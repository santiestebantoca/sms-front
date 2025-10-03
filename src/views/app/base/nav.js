import useAuthStore from '@/stores/auth'
import { computed } from 'vue'

export default function useNavOptions() {
  const admin = useAuthStore().authUser.admin
  const options = computed(() => ({
    header: [
      { to: '/sms', label: 'Mensaje' },
      { to: '/configurar', icon: 'gear', tooltip: 'Configurar' }
    ],
    componer: [
      {
        to: { name: 'sms-componer' },
        icon: 'envelope-plus',
        label: 'Componer'
      },
      {
        to: { name: 'sms-coleccion' },
        icon: 'collection',
        label: 'Colección'
      },
    ],
    configurar: [
      {
        to: { name: 'configurar-grupos' },
        icon: 'subtract',
        label: 'Grupos'
      },
      {
        to: { name: 'configurar-suscriptores' },
        icon: 'people-fill',
        label: 'Suscriptores'
      },
      ...admin ? [{
        to: { name: 'configurar-users' },
        icon: 'person-workspace',
        label: 'Usuarios'
      }] : [],
      {
        to: { name: 'configurar-plantillas' },
        icon: 'card-text',
        label: 'Plantillas'
      },
    ]
  }))
  return { options }
}
