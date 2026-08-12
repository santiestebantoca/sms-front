import { useQuery, defineQuery } from '@pinia/colada'
import { notificacionesApi as api } from '@/api/notificaciones'
import { queryKeys } from '@/lib/query-keys'
import { ref } from 'vue'

export const useNotificacionesQuery = () => {
  const { data, isPending, refresh } = useQuery({
    key: () => queryKeys.notificaciones.listas(),
    query: () => api.getAll(),
    autoRefetch: true,
    staleTime: 60000
  })

  return {
    notificaciones: data,
    isPending,
    refresh,
  }
}