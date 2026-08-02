import { useQuery } from '@pinia/colada'
import { mensajesApi as api } from '@/api/mensajes'
import { queryKeys } from '@/lib/query-keys'

export const useMensajeQuery = (id) => {
  return useQuery({
    key: () => queryKeys.mensajes.detalle(id),
    query: () => api.getById(id),
    enabled: !!id
  })
}