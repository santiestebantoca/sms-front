import { useQuery } from '@pinia/colada'
import { flatToTree } from '@/utils'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'
import { computed } from 'vue'

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

export function useGruposNotificablesQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.listaNotificables(),
    query: () => api.getAll({ label: 'grupo,centro' }),
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

export function useGruposOrigenesQuery() {
  const { data, isPending } = useQuery({
    key: queryKeys.grupos.listaOrigenes(),
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