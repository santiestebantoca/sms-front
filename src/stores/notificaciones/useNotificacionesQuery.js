import { useQuery, defineQuery } from '@pinia/colada'
import { useDebounce } from '@vueuse/core'
import { notificacionesApi as api } from '@/api/notificaciones'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export const useNotificacionesQuery = () => {
  const { data, isPending, refresh } = useQuery({
    key: () => queryKeys.notificaciones.listas(),
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