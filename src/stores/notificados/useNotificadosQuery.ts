import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notificadosApi as api } from '@/api/notificados'
import { ref, Ref, toValue } from 'vue'

export function useNotificadosDeLosGruposQuery(gruposIds?: number[] | string[] | Ref) {

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.notificados.lista({ origen: toValue(gruposIds) }),
    query: () => api.getAll({ origen: toValue(gruposIds) }),
    enabled: () => toValue(gruposIds)?.length > 0
  })

  return {
    notificados: data,
    isLoading,
    isPending
  }
}

export function useNotificadosDelGrupoQuery(grupoId?: number | string | Ref) {

  const { data, isLoading, isPending } = useQuery({
    key: () => queryKeys.notificados.lista({ origen: toValue(grupoId) }),
    query: () => api.getAll({ origen: toValue(grupoId) }),
    enabled: () => Boolean(toValue(grupoId)),
    staleTime: Infinity
  })

  return {
    notificados: data,
    isLoading,
    isPending,
  }
}
