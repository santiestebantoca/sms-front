import { useQuery } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notificadosApi as api } from '@/api/notificados'
import { computed, ref, watch, watchEffect } from 'vue'

// export function useNotificadosConSuscriptoresQuery() {
//   const origenes = ref([])
//   const filtro = computed(() => ({ origen: origenes.value, include: 'suscriptor' }))

//   const { data, isPending } = useQuery({
//     key: () => queryKeys.notificados.lista(filtro.value),
//     query: () => api.getAll(filtro.value),
//     enabled: () => origenes.value.length
//   })

//   const total = computed(() => data.value.length)

//   return {
//     notificados: data,
//     isPending,
//     origenes,
//     total
//   }
// }

export function useNotificadosQuery() {
  const origenes = ref([])
  const origenesIds = computed(() => origenes.value.map(d => d.id))
  const filtro = computed(() => ({ origen: origenesIds.value, include: 'suscriptor' }))

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.notificados.lista(filtro.value),
    query: () => api.getAll(filtro.value),
    enabled: () => origenes.value.length
  })

  const total = computed(() => data.value.length)

  //
  // Lógica de selección fina de suscriptores de los grupos notificados
  // Inicialmente son todos pero se pueden cambiar directamente o a través de sus grupos 
  //
  const gruposIds = ref([])
  const destinatariosIds = ref([])
  const oldVal = ref([]) // Permite resetear cuando cambia notificados 

  watchEffect(() => {
    oldVal.value = destinatariosIds.value = []
    gruposIds.value = data.value?.map(grupo => grupo.id) || []
  })
  // Marcar suscriptores a través de su grupo 
  watch(gruposIds, newVal => {
    // Sets temporales SOLO para comparación eficiente (O(1) lookup)
    const oldSet = new Set(oldVal.value)
    const newSet = new Set(newVal)
    const agregados = [...newSet].filter(id => !oldSet.has(id))
    const eliminados = [...oldSet].filter(id => !newSet.has(id))
    agregados.forEach(grupoId => data.value?.find(grupo => grupo.id === grupoId)?.suscriptores
      .forEach(suscriptor => {
        // Evitar duplicados: v-model no los genera, pero la sincronización automática sí podría
        if (!destinatariosIds.value.includes(suscriptor.id)) destinatariosIds.value.push(suscriptor.id)
      }))
    eliminados.forEach(grupoId => data.value.find(grupo => grupo.id === grupoId)?.suscriptores
      .forEach(suscriptor => {
        destinatariosIds.value = destinatariosIds.value.filter(item => item !== suscriptor.id)
      }))
    oldVal.value = newVal
  })
  //
  //

  return {
    notificados: data,
    isPending,
    isLoading,
    origenes,
    total, // De grupos notificados
    gruposIds, // Para manipular destinatariosIds
    destinatariosIds // Para formularios
  }
}

//   const post = async (_data) => {
//     status.value.loading = true
//     const result = await api.create(_data)
//     status.value.loading = false
//     return result
//   }

//   const reset = () => {
//     status.value.loaded = status.value.resetting = true
//     data.value = []
//     nextTick(() => status.value.resetting = false)
//   }