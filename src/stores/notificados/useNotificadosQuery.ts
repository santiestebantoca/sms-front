import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notificadosApi as api } from '@/api/notificados'
import { ref } from 'vue'

export function useNotificadosDeLosGruposQuery() {
  const gruposIds = ref([])

  const { data, isLoading } = useQuery({
    key: () => queryKeys.notificados.lista({ origen: gruposIds.value }),
    query: () => api.getAll({ origen: gruposIds.value }),
    enabled: () => gruposIds.value.length > 0
  })

  return {
    notificados: data,
    isLoading,
    gruposIds
  }
}

export function useNotificadosDelGrupoQuery(id?: number | string) {
  const grupoId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.notificados.lista({ origen: grupoId.value }),
    query: () => api.getAll({ origen: grupoId.value }),
    enabled: () => Boolean(grupoId.value),
    staleTime: Infinity
  })

  return {
    notificados: data,
    isPending,
    grupoId
  }
}
