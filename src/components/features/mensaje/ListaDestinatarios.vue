<script lang="ts" setup>
const props = defineProps({ mensajeId: Number })

import { useEnviosQuery } from '@/stores/envios'

const { destinatarios, isLoading, mensajeId } = useEnviosQuery()
</script>

<template>
  <BModal title="Destinatarios" no-footer @show="mensajeId = props.mensajeId">
    <div v-if="isLoading" class="text-center py-4">
      <BSpinner />
    </div>
    <BListGroup v-else-if="destinatarios?.length" flush>
      <BListGroupItem v-for="destinatario in destinatarios" class="border-0">
        {{ destinatario.nombre }}
        <span class="text-yellow-700">..\{{ destinatario.grupo }}</span>
      </BListGroupItem>
    </BListGroup>
    <div v-else class="text-center py-4">
      <ILucideTriangleAlert class="me-3 mb-1 fs-5 text-warning" />
      No se encontraron destinatarios.
    </div>
  </BModal>
</template>