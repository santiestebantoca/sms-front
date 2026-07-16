import { useQuery } from '@pinia/colada'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { queryKeys } from '@/lib/query-keys'
import { toValue } from 'vue'

export function useSuscriptorQuery(id) {
  const { data, isPending } = useQuery({
    key: () => queryKeys.suscriptores.detalle(toValue(id)),
    query: () => api.getById(toValue(id)),
  })

  return {
    suscriptor: data,
    isPending,
  }
}