import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { computed } from 'vue'

export function useSuscriptoresQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.suscriptores.listas(),
    query: () => api.getAll(),
  })

  return {
    suscriptores: data,
    isPending,
  }
}