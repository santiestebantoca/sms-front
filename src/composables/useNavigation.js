import { useAuthStore } from '@/stores/auth'
import { useSmssMetaStore } from '@/stores/smss'
import { computed, onUnmounted } from 'vue'

export default function useNavigation() {
  const auth = useAuthStore()
  const meta = useSmssMetaStore()
  const options = computed(() => ({
    header: [
      { to: '/sms', label: 'Mensaje', id: 'nav-options-header-sms' },
      { to: '/configurar', icon: 'bi-gear', tooltip: 'Configurar', id: 'nav-options-header-configurar' }
    ],
    componer: [
      {
        to: { name: 'sms-componer' },
        icon: 'bi-envelope-plus',
        label: 'Componer',
        name: 'componer',
        id: 'nav-options-componer-sms-componer'
      },
      {
        to: { name: 'sms-coleccion' },
        icon: 'bi-collection',
        label: 'Colección',
        name: 'coleccion',
        id: 'nav-options-componer-sms-coleccion',
        count: meta.data.pendientes
      },
    ],
    configurar: [
      {
        to: { name: 'configurar-grupos' },
        icon: 'bi-subtract',
        label: 'Grupos',
        name: 'grupos',
        id: 'nav-options-configurar-grupos'
      },
      {
        to: { name: 'configurar-suscriptores' },
        icon: 'bi-people-fill',
        label: 'Suscriptores',
        name: 'suscriptores',
        id: 'nav-options-configurar-suscriptores'
      },
      {
        to: { name: 'configurar-plantillas' },
        icon: 'bi-card-text',
        label: 'Plantillas',
        name: 'plantillas',
        id: 'nav-options-configurar-plantillas'
      },
      ...auth.authUser.admin ? [{
        to: { name: 'configurar-users' },
        icon: 'bi-person-workspace',
        label: 'Usuarios',
        name: 'users',
        id: 'nav-options-configurar-users'
      }] : [],
    ]
  }))

  return { options }
}
