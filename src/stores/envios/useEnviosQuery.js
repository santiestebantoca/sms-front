import { useQuery } from '@pinia/colada'
import { enviosApi as api } from '@/api/envios'
import { queryKeys } from '@/lib/query-keys'
import { ref } from 'vue'

export const useEnviosQuery = (id) => {
  const mensajeId = ref(id)

  const { data, isLoading } = useQuery({
    key: () => queryKeys.envios.lista({ mensaje_id: mensajeId.value }),
    query: () => api.getAll({ mensaje_id: mensajeId.value }),
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