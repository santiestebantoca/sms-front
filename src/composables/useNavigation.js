import useAuthStore from '@/stores/auth'
import useColeccionStore from '@/stores/coleccion'
import { computed, onUnmounted } from 'vue'

export default function useNavigation() {
  const admin = useAuthStore().authUser.admin
  const coleccion = useColeccionStore().nav
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
        count: coleccion.data
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
      ...admin ? [{
        to: { name: 'configurar-users' },
        icon: 'bi-person-workspace',
        label: 'Usuarios',
        name: 'users',
        id: 'nav-options-configurar-users'
      }] : [],
      {
        to: { name: 'configurar-plantillas' },
        icon: 'bi-card-text',
        label: 'Plantillas',
        name: 'plantillas',
        id: 'nav-options-configurar-plantillas'
      },
    ]
  }))

  coleccion.startPolling()

  onUnmounted(() => coleccion.stopPolling())

  return { options }
}
