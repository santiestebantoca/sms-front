import { useQuery } from '@pinia/colada'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { queryKeys } from '@/lib/query-keys'
import { Ref, toValue } from 'vue'

export function useSuscriptorQuery(suscriptorId?: number | string | Ref) {

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.suscriptores.detalle(toValue(suscriptorId)),
    query: () => api.getById(toValue(suscriptorId)),
    enabled: () => Boolean(toValue(suscriptorId)),
    staleTime: Infinity
  })

  return {
    suscriptor: data,
    isPending,
    isLoading,
  }
}
