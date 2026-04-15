<script setup>
const props = defineProps({ data: Object })

import { ref } from 'vue'

const acciones = ref([
  {
    texto: "Editar",
    to: { name: 'configurar-grupo-editar' },
    icon: "bi-pencil"
  },
  {
    texto: "Eliminar",
    to: { name: 'configurar-grupo-eliminar' },
    icon: "bi-trash"
  },
])
</script>

<template>
  <div class="mt-2 hstack gap-2 justify-content-end">
    <BButton v-for="accion in acciones" variant="flat-outline-dark" :to="accion.to" class="btn-sm">
      <UIcon :name="accion.icon" /> {{ accion.texto }}
    </BButton>
  </div>
  <div class="px-3 py-2">
    <div class="label-value">
      <label>Nombre</label>
      <div class="value" v-text="data.nombre" />
    </div>
    <div class="label-value">
      <label>Alias</label>
      <div class="value" v-text="data.apodo || '-'" />
    </div>
    <div class="label-value">
      <label>Etiquetas</label>
      <div class="value" v-text="data.label || '-'" />
    </div>
    <div class="label-value">
      <label>Descripción</label>
      <div v-text="data.descripcion || '-'" />
    </div>
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