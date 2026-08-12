<script lang="ts" setup>
const origenes = defineModel<Array<{ id: string | number; apodo?: string; nombre: string }>>('origenes')
const destinatariosIds = defineModel<Array<string | number>>('destinatariosIds')

import ListaNotificados from './ListaNotificados.vue'
import ListaDestinatarios from './ListaDestinatarios.vue'
import { useNotificadosDeLosGruposQuery } from '@/stores/notificados'
import { ref, computed, watch, watchEffect } from 'vue'

const notificadosIds = ref([]) // notificados ids first but UI can changes it to control destinatariosIds
const oldVal = ref([])
const verListaNotificados = ref(false)
const verListaDestinatarios = ref(false)
const { notificados, isLoading: cargandoNotificados, gruposIds } = useNotificadosDeLosGruposQuery()
const origenesButtons = computed(() => origenes.value.map((grupo) => ({
  text: grupo.apodo || grupo.nombre,
  do: () => quitarOrigen(grupo.id),
  variant: 'flat-dark',
  tippy: `${grupo.nombre} (Click para quitar)`,
})))
const notificadosButton = computed(() => notificados.value && ({
  text: notificados.value.length === 0
    ? 'Ningún grupo notificado'
    : notificados.value.length === 1
      ? '1 grupo notificado'
      : `${notificados.value.length} grupos notificados`,
  do: () => verListaNotificados.value = true,
  variant: notificados.value.length === 0 ? 'flat-danger' : 'flat-primary'
}))
const destinatariosButton = computed(() => notificados.value?.length && ({
  text: destinatariosIds.value.length === 0
    ? 'Ningún destinatario' // Debe impedirse esta condición
    : destinatariosIds.value.length === 1
      ? '1 destinatario'
      : `${destinatariosIds.value.length} destinatarios`,
  do: () => verListaDestinatarios.value = true,
  variant: destinatariosIds.value.length === 0 ? 'flat-danger' : 'flat-primary'
}))

watchEffect(() => gruposIds.value = origenes.value.map((grupo) => grupo.id))
watchEffect(() => {
  oldVal.value = destinatariosIds.value = []
  notificadosIds.value = notificados.value?.map(grupo => grupo.id) || []
})
// Calcula destinatariosIds permitiendo filtar por su grupo través de notificadosIds 
watch(notificadosIds, newVal => {
  // Sets temporales SOLO para comparación eficiente (O(1) lookup)
  let tempArray = [...destinatariosIds.value]
  const oldSet = new Set(oldVal.value)
  const newSet = new Set(newVal)
  const agregados = [...newSet].filter(id => !oldSet.has(id))
  const eliminados = [...oldSet].filter(id => !newSet.has(id))
  agregados.forEach(grupoId => notificados.value?.find(grupo => grupo.id === grupoId)?.suscriptores
    .forEach(suscriptor => {
      // Evitar duplicados: v-model no los genera, pero la sincronización automática sí podría
      if (!tempArray.includes(suscriptor.id)) tempArray.push(suscriptor.id)
    }))
  eliminados.forEach(grupoId => notificados.value.find(grupo => grupo.id === grupoId)?.suscriptores
    .forEach(suscriptor => {
      tempArray = tempArray.filter(item => item !== suscriptor.id)
    }))
  destinatariosIds.value = tempArray
  oldVal.value = newVal
})

const quitarOrigen = grupoId => {
  origenes.value = origenes.value.filter(grupo => grupo.id !== grupoId)
}
</script>

<template>
  <div class="hstack flex-wrap overflow-hidden">
    <UIcon name="bi-subtract" class="flex-shrink-0 me-2 text-yellow" />
    <BButton v-for="origen, index in origenesButtons" :key="index" :variant="origen.variant" class="btn-sm fs-6"
      @click="origen.do" v-tippy="origen.tippy">
      {{ origen.text }}
    </BButton>
    <UIcon name="bi-chevron-right" class="flex-shrink-0 mx-1" font-size="12" />
    <template v-if="cargandoNotificados">
      <span class="btn-label">...</span>
    </template>
    <template v-else-if="notificados">
      <template v-if="notificadosButton">
        <BButton class="btn-sm fs-6" :variant="notificadosButton.variant" @click="notificadosButton.do">
          <span v-text="notificadosButton.text" class="btn-label" />
        </BButton>
      </template>
      <template v-if="destinatariosButton">
        <BButton class="btn-sm fs-6" :variant="destinatariosButton.variant" @click="destinatariosButton.do">
          <span v-text="destinatariosButton.text" class="btn-label" />
        </BButton>
      </template>
    </template>
  </div>
  <ListaNotificados v-model:show="verListaNotificados" :notificados="notificados"
    v-model:notificadosIds="notificadosIds" v-model:destinatariosIds="destinatariosIds" />
  <ListaDestinatarios v-model:show="verListaDestinatarios" :notificados="notificados"
    v-model:destinatariosIds="destinatariosIds" />
</template>

<style scoped>
.btn-label {
  margin-bottom: 2px;
}
</style>