import { useQuery } from '@pinia/colada'
import { enviosApi as api } from '@/api/envios'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export const useEnviosQuery = (id) => {
  const mensajeId = ref(id)
  const filtro = computed(() => ({ mensaje_id: mensajeId.value }))

  const { data, isLoading } = useQuery({
    key: () => queryKeys.envios.lista(filtro.value),
    query: () => api.getAll(filtro.value),
    enabled: () => !!mensajeId.value,
    staleTime: Infinity,
  })

  return {
    destinatarios: data,
    suscriptores: data,
    isLoading,
    mensajeId
  }
}