<script setup>
const props = defineProps({ data: Object })

import { ref, computed, watch } from 'vue'

const active = ref(null)
const acciones = computed(() => [
  {
    texto: "Nuevo",
    to: { name: 'configurar-grupo-hijos-crear' },
    icon: "bi-plus-lg"
  },
  {
    texto: "Editar",
    to: active.value
      ? { name: 'configurar-grupo-hijo-editar', params: { hijoId: active.value } }
      : undefined,
    icon: "bi-pencil",
    disabled: !active.value
  },
  {
    texto: "Eliminar",
    to: active.value
      ? { name: 'configurar-grupo-hijo-eliminar', params: { hijoId: active.value } }
      : undefined,
    icon: "bi-trash",
    disabled: !active.value
  },
])
//
// Cuando se elimina un item, active no está en items, entonces active = null
watch(() => props.data.children, (items) => {
  if (!items.some(item => item.id === active.value)) active.value = null
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
    <div v-if="!data.children.length" class="mt-2">
      No hay grupos aquí.
    </div>
    <RootTree v-else list selectable v-model="active">
      <TreeNode v-for="data in data.children" :data="data" :key="data.id">
        <template #default="{ data }">
          <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
          <span v-text="data.nombre" class="text-truncate" />
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