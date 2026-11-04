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
const gruposIds = ref<Array<string | number>>([])
const { notificados, isLoading: cargandoNotificados } = useNotificadosDeLosGruposQuery(gruposIds)
const origenesButtons = computed(() => origenes.value.map((grupo) => ({
  texto: grupo.apodo || grupo.nombre,
  quitar: () => quitarOrigen(grupo.id),
  variant: 'flat h-36',
  tippy: `${grupo.nombre} (Click para quitar)`,
})))
const notificadosButton = computed(() => notificados.value && ({
  texto: notificados.value.length === 0
    ? 'Ningún grupo notificado'
    : notificados.value.length === 1
      ? '1 grupo notificado'
      : `${notificados.value.length} grupos notificados`,
  notificados: () => verListaNotificados.value = true,
  variant: (notificados.value.length === 0 ? 'flat-danger' : 'flat-primary') + ' h-36'
}))
const destinatariosButton = computed(() => notificados.value?.length && ({
  texto: destinatariosIds.value.length === 0
    ? 'Ningún destinatario' // Debe impedirse esta condición
    : destinatariosIds.value.length === 1
      ? '1 destinatario'
      : `${destinatariosIds.value.length} destinatarios`,
  destinatarios: () => verListaDestinatarios.value = true,
  variant: (destinatariosIds.value.length === 0 ? 'flat-danger' : 'flat-primary') + ' h-36'
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
  <div class="hstack flex-wrap overflow-hidden h-36">
    <ILucideSquaresUnite class="flex-shrink-0 me-2 text-yellow" />
    <BButton v-for="origen, index in origenesButtons" :key="index" :variant="origen.variant" @click="origen.quitar"
      v-tippy="origen.tippy" style="padding-top: 5px;">
      {{ origen.texto }}
    </BButton>
    <ILucideChevronRight class="flex-shrink-0 mx-1 text-secondary small" />
    <template v-if="cargandoNotificados">
      ...
    </template>
    <template v-else-if="notificados">
      <template v-if="notificadosButton">
        <BButton :variant="notificadosButton.variant" @click="notificadosButton.notificados" style="padding-top: 5px;">
          {{ notificadosButton.texto }}
        </BButton>
      </template>
      <template v-if="destinatariosButton">
        <BButton :variant="destinatariosButton.variant" @click="destinatariosButton.destinatarios"
          style="padding-top: 5px;">
          {{ destinatariosButton.texto }}
        </BButton>
      </template>
    </template>
  </div>
  <ListaNotificados v-model:show="verListaNotificados" :notificados="notificados"
    v-model:notificadosIds="notificadosIds" v-model:destinatariosIds="destinatariosIds" />
  <ListaDestinatarios v-model:show="verListaDestinatarios" :notificados="notificados"
    v-model:destinatariosIds="destinatariosIds" />
</template>