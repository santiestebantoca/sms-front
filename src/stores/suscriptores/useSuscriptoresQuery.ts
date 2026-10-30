import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { Ref, toValue } from 'vue'

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

export function useSuscriptoresDelGrupoQuery(grupoId?: number | string | Ref) {

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.suscriptores.lista({ grupo: toValue(grupoId) }),
    query: () => api.getAll({ grupo: toValue(grupoId) }),
    staleTime: Infinity
  })

  return {
    suscriptores: data,
    isPending,
    isLoading
  }
}
