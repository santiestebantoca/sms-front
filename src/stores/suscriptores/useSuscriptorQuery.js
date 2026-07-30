import { useQuery } from '@pinia/colada'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { queryKeys } from '@/lib/query-keys'
import { ref } from 'vue'

export function useSuscriptorQuery(id) {
  const suscriptorId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.suscriptores.detalle(suscriptorId.value),
    query: () => api.getById(suscriptorId.value),
    enabled: () => !!suscriptorId.value
  })

  return {
    suscriptor: data,
    isPending,
    suscriptorId
  }
}