<script lang="ts" setup>
const props = defineProps({ mensajeId: Number })

import { useEnviosQuery } from '@/stores/envios'
import { ref } from 'vue'

const { destinatarios, isLoading, mensajeId } = useEnviosQuery()
</script>

<template>
  <BModal title="Destinatarios" no-footer @show="mensajeId = props.mensajeId">
    <div v-if="isLoading" class="text-center py-4">
      <BSpinner />
    </div>
    <RootTree v-else-if="destinatarios?.length" list no-hover>
      <TreeNode v-for="data in destinatarios" :data="data" :key="data.id">
        <template #default="{ data }">
          <span v-text="data.nombre" />
          <span v-text="'..\\' + data.grupo" class="text-yellow-700" />
        </template>
      </TreeNode>
    </RootTree>
    <div v-else class="text-center py-4">
      <UIcon name="bi-exclamation-triangle-fill" class="me-3 mb-1 fs-5 text-warning" />
      No se encontraron destinatarios.
    </div>
  </BModal>
</template>