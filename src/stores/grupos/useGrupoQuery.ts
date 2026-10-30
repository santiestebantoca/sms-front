import { useQuery } from '@pinia/colada'
import { gruposApi as api } from '@/api/grupos'
import { queryKeys } from '@/lib/query-keys'
import { toValue, Ref } from 'vue'

export function useGrupoQuery(grupoId?: number | string | Ref) {
  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.grupos.detalle(toValue(grupoId)),
    query: () => api.getById(toValue(grupoId)),
    enabled: () => !!toValue(grupoId),
    staleTime: Infinity,
    placeholderData: (previousData) => previousData,
  })

  return {
    grupo: data,
    isPending,
    isLoading,
  }
}
