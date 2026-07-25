import { useQuery, defineQuery } from '@pinia/colada'
import { useDebounce } from '@vueuse/core'
import { mensajesApi as api } from '@/api/mensajes'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export const useMensajesNotificacionesQuery = () => {
  const { data, isPending, refresh } = useQuery({
    key: () => queryKeys.mensajes.notificaciones(),
    query: () => api.notificaciones(),
    autoRefetch: true,
    staleTime: 60000
  })

  return {
    notificaciones: data,
    isPending,
    refresh,
  }
}