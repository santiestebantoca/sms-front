import { useAuthQuery } from '@/stores/auth'
import { useNotificacionesQuery } from '@/stores/notificaciones'
import { computed } from 'vue'

export function useNavigationHeader() {
  const options = computed(() => [
    {
      to: '/sms',
      label: 'Mensaje',
      id: 'nav-options-header-sms'
    },
    {
      to: '/configurar',
      icon: 'lucide-settings',
      tooltip: 'Configurar',
      id: 'nav-options-header-configurar'
    }
  ])

  return { options }
}

export function useNavigationMensaje() {
  const { notificaciones } = useNotificacionesQuery()
  const options = computed(() => [
    {
      to: { name: 'sms-componer' },
      icon: 'lucide-mail-plus',
      label: 'Componer',
      name: 'componer',
      id: 'nav-options-componer-sms-componer'
    },
    {
      to: { name: 'sms-coleccion' },
      icon: 'lucide-mails',
      label: 'Colección',
      name: 'coleccion',
      id: 'nav-options-componer-sms-coleccion',
      count: notificaciones.value?.pendientes
    },
  ])

  return { options }
}

export function useNavigationConfigurar() {
  const { authUser } = useAuthQuery()
  const options = computed(() => [
    {
      to: { name: 'configurar-grupos' },
      icon: 'lucide-squares-unite',
      label: 'Grupos',
      name: 'grupos',
      id: 'nav-options-configurar-grupos'
    },
    {
      to: { name: 'configurar-suscriptores' },
      icon: 'lucide-users',
      label: 'Suscriptores',
      name: 'suscriptores',
      id: 'nav-options-configurar-suscriptores'
    },
    {
      to: { name: 'configurar-plantillas' },
      icon: 'lucide-text',
      label: 'Plantillas',
      name: 'plantillas',
      id: 'nav-options-configurar-plantillas'
    },
    ...authUser.value?.admin ? [{
      to: { name: 'configurar-usuarios' },
      icon: 'lucide-user-shield',
      label: 'Usuarios',
      name: 'users',
      id: 'nav-options-configurar-usuarios'
    }] : [],
  ])

  return { options }
}