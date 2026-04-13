<script setup>
const props = defineProps({ data: Object })

import { ref, computed, watch } from 'vue'

const active = ref(null)
const acciones = computed(() => [
  { texto: "Nuevo", to: { name: 'configurar-grupo-detalles-suscriptores-crear' }, icon: "bi-plus-lg" },
  { texto: "Editar", to: { name: 'configurar-grupo-detalles-suscriptor-editar', params: { suscriptor: active.value } }, icon: "bi-pencil", disabled: !active.value },
  { texto: "Eliminar", to: { name: 'configurar-grupo-detalles-suscriptor-eliminar', params: { suscriptor: active.value } }, icon: "bi-trash", disabled: !active.value },
])
//
// Cuando se elimina un grupo, active no está en data.children, entonces active = null
watch(() => props.data, ({ suscriptores }) => {
  if (!suscriptores.some(d => d.id === active.value)) active.value = null
})
</script>

<template>
  <div class="mt-2 hstack gap-2 justify-content-end">
    <BButton v-for="accion in acciones" variant="flat-outline-dark" :to="accion.to" :disabled="accion.disabled"
      class="btn-sm">
      <UIcon :name="accion.icon" /> {{ accion.texto }}
    </BButton>
  </div>
  <div class="px-3 py-2">
    <div v-if="!data.suscriptores.length" class="mt-2">
      No hay suscriptores aquí.
    </div>
    <RootTree v-else list selectable v-model="active">
      <TreeNode v-for="data in data.suscriptores" :data="data" :key="data.id">
        <template #default="{ data }">
          <UIcon name="bi-person-fill" style="color:var(--bs-info-700)" />
          {{ data.nombre }}
          <span v-text="data.telefono" style="color:var(--bs-pink)" />
          <span v-if="data.correo" v-text="`<${data.correo}>`" />
        </template>
      </TreeNode>
    </RootTree>
  </div>
</template>

<style scoped>
.label-value {
  margin-bottom: 8px;
}

.label-value>label {
  color: var(--bs-gray-600);
  font-size: .875em;
}

.label-value>div {
  padding: 2px 0;
}
</style>