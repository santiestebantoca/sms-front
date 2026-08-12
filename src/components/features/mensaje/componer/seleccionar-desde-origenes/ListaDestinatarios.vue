<script lang="ts" setup>
const show = defineModel<boolean>('show')
const destinatariosIds = defineModel<Array<string | number>>('destinatariosIds') // Subset de ids de notificados
const props = defineProps<{
  notificados?: Array<{ id: string | number; nombre?: string; telefono?: string; suscriptores?: Array<{ id: string | number; nombre?: string; telefono?: string }> }>
}>()

import { computed } from 'vue'

const destinatarios = computed(() => props.notificados?.flatMap(obj => obj.suscriptores) || [])
</script>

<template>
  <BModal v-model="show" title="Destinatarios">
    <div v-if="!destinatariosIds.length" class="alerted">
      Seleccione al menos un destinatario
    </div>
    <RootTree :childrenNames="['suscriptores']" list>
      <TreeNode v-for="data in destinatarios" :data="data" :key="data.id">
        <template #default="{ data }">
          <input type="checkbox" v-model="destinatariosIds" :value="data.id" />
          <span v-text="data.nombre" class="text-truncate" />
          <span v-text="data.telefono" class="text-pink" />
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="show = false">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>

<style scoped>
.alerted {
  padding: 2px 16px 4px;
  margin: 0 -16px;
  background-color: var(--bs-danger);
  color: #f2f2f2;
  font-size: .875em;
  font-weight: 600;
  position: relative;
  top: -16px;
}
</style>