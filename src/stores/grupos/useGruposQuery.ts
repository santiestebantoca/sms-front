import { useQuery } from '@pinia/colada'
import { flatToTree } from '@/utils'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'
import { toValue, computed, Ref } from 'vue'

export function useGruposQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.listas(),
    query: () => api.getAll(),
  })

  const tree = computed(() => {
    if (!data.value) return []
    return flatToTree(data.value, { parentKey: 'pertenece' })
  })

  return {
    grupos: tree,
    isPending,
  }
}

export function useGruposDelGrupoQuery(padreId?: number | string | Ref) {

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.grupos.lista({ pertenece: toValue(padreId) }),
    query: () => api.getAll({ pertenece: toValue(padreId) }),
    staleTime: Infinity
  })

  return {
    grupos: data,
    isPending,
    isLoading
  }
}

export function useGruposNotificablesQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.lista({ label: 'grupo,centro' }),
    query: () => api.getAll({ label: 'grupo,centro' }),
    staleTime: Infinity
  })

  const tree = computed(() => {
    if (!data.value) return []
    return flatToTree(data.value, { parentKey: 'pertenece' })
  })

  return {
    data,
    grupos: tree,
    isPending,
    options: computed(() => data.value?.map(d => ({ value: d.id, text: d.nombre })))
  }
}

export function useGruposOrigenesQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.lista({ label: 'centro,origen' }),
    query: () => api.getAll({ label: 'centro,origen' }),
  })

  const tree = computed(() => {
    if (!data.value) return []
    return flatToTree(data.value, { parentKey: 'pertenece' })
  })

  return {
    grupos: tree,
    isPending,
  }
}
