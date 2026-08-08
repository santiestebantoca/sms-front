import { useQuery } from '@pinia/colada'
import { enviosApi as api } from '@/api/envios'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export const useEnviosQuery = (id) => {
  const mensajeId = ref(id)

  const { data, isLoading } = useQuery({
    key: () => queryKeys.envios.lista({ mensaje_id: mensajeId.value }),
    query: () => api.getAll({ mensaje_id: mensajeId.value }),
    enabled: () => !!mensajeId.value,
    staleTime: Infinity,
  })

  const normal = computed(() => data.value
    ? data.value.map((d) => ({
      id: d.suscriptor_id,
      nombre: d.suscriptor,
      grupo: d.grupo
    }))
    : data.value
  )

  return {
    destinatarios: normal,
    suscriptores: normal,
    isLoading,
    mensajeId
  }
}