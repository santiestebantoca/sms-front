import { defineStore, storeToRefs } from 'pinia'
import { useGruposNotificadosStore } from './notificados'
import { ref, computed, watch, watchEffect, nextTick } from 'vue'

export const useNotificadosCheckedStore = defineStore('notificados-checked', () => {
  const { data: notificados } = storeToRefs(useGruposNotificadosStore())
  const gruposIds = ref([])
  const destinatariosIds = ref([])
  const oldVal = ref([]) // Permite resetear cuando cambia notificados 

  watchEffect(() => {
    oldVal.value = destinatariosIds.value = []
    gruposIds.value = notificados.value.map(grupo => grupo.id)
  })
  // Marcar suscriptores a través de su grupo 
  watch(gruposIds, newVal => {
    // Sets temporales SOLO para comparación eficiente (O(1) lookup)
    const oldSet = new Set(oldVal.value)
    const newSet = new Set(newVal)
    const agregados = [...newSet].filter(id => !oldSet.has(id))
    const eliminados = [...oldSet].filter(id => !newSet.has(id))
    agregados.forEach(grupoId => notificados.value?.find(grupo => grupo.id === grupoId)?.suscriptores
      .forEach(suscriptor => {
        // Evitar duplicados: v-model no los genera, pero la sincronización automática sí podría
        if (!destinatariosIds.value.includes(suscriptor.id)) destinatariosIds.value.push(suscriptor.id)
      }))
    eliminados.forEach(grupoId => notificados.value.find(grupo => grupo.id === grupoId)?.suscriptores
      .forEach(suscriptor => {
        destinatariosIds.value = destinatariosIds.value.filter(item => item !== suscriptor.id)
      }))
    oldVal.value = newVal
  })

  return { gruposIds, destinatariosIds }
})