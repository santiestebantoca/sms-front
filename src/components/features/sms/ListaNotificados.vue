<script setup>
const props = defineProps({ notificados: Array, loading: Boolean })
</script>

<template>
  <BModal title="Notificados" no-footer>
    <div v-if="loading" class="text-center py-4">
      <BSpinner />
    </div>
    <RootTree v-else-if="notificados?.length" list no-hover>
      <TreeNode v-for="data in notificados" :data="data" :key="data.id">
        <template #default="{ data }">
          <span v-text="data.suscriptor" />
          <span class="text-warning" v-text="'..\\' + data.grupo" />
        </template>
      </TreeNode>
    </RootTree>
    <div v-else class="text-center py-4">
      <UIcon name="bi-exclamation-triangle-fill" class="me-3 mb-1 fs-5 text-warning" />
      No se encontraron suscriptores notificados.
    </div>
  </BModal>
</template>