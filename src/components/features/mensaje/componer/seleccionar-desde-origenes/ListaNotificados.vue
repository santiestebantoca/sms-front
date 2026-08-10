<script setup>
const show = defineModel('show')
const notificadosIds = defineModel('notificadosIds') // Subset de ids de notificados
const destinatariosIds = defineModel('destinatariosIds') // Subset de ids de notificados
const props = defineProps({
  notificados: Array || undefined
})
</script>

<template>
  <BModal v-model="show" title="Grupos notificados">
    <div v-if="!destinatariosIds.length" class="alerted">
      Seleccione al menos un destinatario
    </div>
    <RootTree :childrenNames="['suscriptores']">
      <TreeNode v-for="data in notificados" :data="data" :key="data.id">
        <template #default="{ data }">
          <template v-if="!data.grupo">
            <input type="checkbox" v-model="notificadosIds" :value="data.id" />
            <UIcon name="bi-subtract" class="text-yellow flex-shrink-0" />
            <span v-text="data.apodo || data.nombre" class="text-truncate" />
          </template>
          <template v-else>
            <input type="checkbox" v-model="destinatariosIds" :value="data.id" />
            <span v-text="data.nombre" class="text-truncate" />
            <span v-text="data.telefono" class="text-pink" />
          </template>
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