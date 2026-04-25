<script setup>
const props = defineProps({ destinatarios: Array, loading: Boolean })
</script>

<template>
  <BModal title="Destinatarios" no-footer>
    <div v-if="loading" class="text-center py-4">
      <BSpinner />
    </div>
    <RootTree v-else-if="destinatarios?.length" list no-hover>
      <TreeNode v-for="data in destinatarios" :data="data" :key="data.id">
        <template #default="{ data }">
          <span v-text="data.suscriptor" />
          <span v-text="'..\\' + data.grupo" style="color:var(--bs-yellow-700)" />
        </template>
      </TreeNode>
    </RootTree>
    <div v-else class="text-center py-4">
      <UIcon name="bi-exclamation-triangle-fill" class="me-3 mb-1 fs-5 text-warning" />
      No se encontraron destinatarios.
    </div>
  </BModal>
</template>