<script lang="ts" setup>
const show = defineModel<boolean>('show')
const destinatariosIds = defineModel<Array<string | number>>('destinatariosIds') // Subset de ids de notificados
const props = defineProps<{
  notificados?: Array<{
    suscriptores?: Array<{
      id: string | number
      nombre?: string
      telefono?: string
    }>
  }>
}>()

import { computed } from 'vue'

const destinatarios = computed(() => props.notificados?.flatMap(obj => obj.suscriptores) || [])
</script>

<template>
  <BModal v-model="show" title="Destinatarios" no-footer>
    <div v-if="!destinatariosIds.length" class="mx-n3 mt-n3 p-3 text-center small text-bg-danger">
      Seleccione al menos un destinatario
    </div>
    <BListGroup flush class="sms-tree">
      <BListGroupItem v-for="data in destinatarios" :key="data.id" class="border-0">
        <BFormCheckbox v-model="destinatariosIds" :value="data.id" class="d-inline me-2" />
        <ILucideUser class="text-teal" />
        <span class="text-truncate me-2">
          {{ data.nombre }}
        </span>
        <span class="text-pink">
          {{ data.telefono }}
        </span>
      </BListGroupItem>
    </BListGroup>
  </BModal>
</template>