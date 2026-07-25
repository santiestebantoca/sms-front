import { useAuthStore } from '@/stores/auth'
import { useMensajesNotificacionesQuery } from '@/stores/mensajes'
import { computed, onUnmounted, watch } from 'vue'

export function useNavigationHeader() {
  const options = computed(() => [
    { to: '/sms', label: 'Mensaje', id: 'nav-options-header-sms' },
    { to: '/configurar', icon: 'bi-gear', tooltip: 'Configurar', id: 'nav-options-header-configurar' }
  ])

  return { options }
}

export function useNavigationMensaje() {
  const { notificaciones } = useMensajesNotificacionesQuery()
  const options = computed(() => [
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
      count: notificaciones.value?.pendientes
    },
  ])

  return { options }
}

export function useNavigationConfigurar() {
  const auth = useAuthStore()
  const options = computed(() => [
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
  ])

  return { options }
}