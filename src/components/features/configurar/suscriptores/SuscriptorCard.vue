<script setup>
const props = defineProps({ data: Object })

import { ref } from 'vue'

const acciones = ref([
  {
    texto: "Editar",
    to: { name: 'configurar-suscriptor-editar' },
    icon: "bi-pencil"
  },
  {
    texto: "Eliminar",
    to: { name: 'configurar-suscriptor-eliminar' },
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
      <label>Teléfono</label>
      <div class="value" v-text="data.telefono || '-'" />
    </div>
    <div class="label-value">
      <label>Correo</label>
      <div class="value" v-text="data.correo || '-'" />
    </div>
    <div class="label-value">
      <label>Cargo</label>
      <div class="value" v-text="data.cargo || '-'" />
    </div>
    <div class="label-value">
      <label>Grupo</label>
      <div v-if="data.grupo" class="hstack" style="height: 32px;">
        <UIcon name="bi-subtract me-2" style="color:var(--bs-yellow);flex-shrink: 0;" />
        <span v-text="data.grupo" class="text-truncate" />
      </div>
      <div v-else>-</div>
    </div>
    <div class="label-value">
      <label>Activo</label>
      <div class="value" v-text="data.activo ? 'Sí' : 'No'" />
    </div>
    <div class="label-value">
      <label>Suplente</label>
      <div v-if="data.suplente" class="hstack" style="height: 32px;">
        <UIcon class="bi-person text-secondary me-2" />
        <span v-text="data.suplente" />
      </div>
      <div v-else>-</div>
    </div>
  </div>
</template>