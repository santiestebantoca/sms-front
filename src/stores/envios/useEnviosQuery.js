import { useQuery } from '@pinia/colada'
import { enviosApi as api } from '@/api/envios'
import { queryKeys } from '@/lib/query-keys'

export const useEnviosQuery = (mensaje_id, enabled) => {
  const query = { mensaje_id }
  return useQuery({
    key: () => queryKeys.envios.lista(query),
    query: () => api.getAll(query),
    staleTime: Infinity,
    enabled
  })
}