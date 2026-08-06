import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { ref } from 'vue'

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

export function useSuscriptoresDelGrupoQuery(id) {
  const grupoId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.suscriptores.lista({ grupo: grupoId.value }),
    query: () => api.getAll({ grupo: grupoId.value }),
    staleTime: Infinity
  })

  return {
    suscriptores: data,
    isPending,
    grupoId
  }
}