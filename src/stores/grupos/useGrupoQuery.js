import { useQuery } from '@pinia/colada'
import { gruposApi as api } from '@/api/grupos'
import { queryKeys } from '@/lib/query-keys'
import { toValue } from 'vue'

export function useGrupoQuery(id) {
  const { data, isPending } = useQuery({
    key: () => queryKeys.grupos.detalle(toValue(id)),
    query: () => api.getById(toValue(id)),
  })

  return {
    grupo: data,
    isPending,
  }
}

export function useGrupoExpandidoQuery(id) {
  const { data, isPending } = useQuery({
    key: () => queryKeys.grupos.detalleExpandido(toValue(id)),
    query: () => api.getById(toValue(id), { include: 'all' }),
  })

  return {
    grupo: data,
    isPending,
  }
}