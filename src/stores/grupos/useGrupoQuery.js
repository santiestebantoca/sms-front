import { useQuery } from '@pinia/colada'
import { gruposApi as api } from '@/api/grupos'
import { suscriptoresApi } from '@/api/suscriptores'
import { notificadosApi } from '@/api/notificados'
import { queryKeys } from '@/lib/query-keys'
import { ref, computed } from 'vue'

export function useGrupoQuery(id) {
  const grupoId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.grupos.detalle(grupoId.value),
    query: () => api.getById(grupoId.value),
    enabled: () => !!grupoId.value,
    staleTime: Infinity
  })

  return {
    grupo: data,
    isPending,
    grupoId
  }
}

export function useGrupoHijosQuery(id) {
  const padreId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.grupos.lista({ pertenece: padreId.value }),
    query: () => api.getAll({ pertenece: padreId.value }),
    staleTime: Infinity
  })

  return {
    grupos: data,
    isPending,
    padreId
  }
}

export function useGrupoSuscriptoresQuery(id) {
  const grupoId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.suscriptores.lista({ grupo: grupoId.value }),
    query: () => suscriptoresApi.getAll({ grupo: grupoId.value }),
    staleTime: Infinity
  })

  return {
    suscriptores: data,
    isPending,
    grupoId
  }
}

export function useGrupoNotificadosQuery(id) {
  const grupoId = ref(id)

  const { data, isPending } = useQuery({
    key: () => queryKeys.notificados.lista({ origen: grupoId.value }),
    query: () => notificadosApi.getAll({ origen: grupoId.value }),
    staleTime: Infinity
  })

  return {
    notificados: data,
    isPending,
    grupoId
  }
}