<script setup>
const props = defineProps({ data: Object })

import { ref } from 'vue'

const acciones = ref([
  {
    texto: "Editar",
    to: { name: 'configurar-plantilla-editar', params: { plantillaId: props.data.id } },
    icon: "bi-pencil"
  },
  {
    texto: "Eliminar",
    to: { name: 'configurar-plantilla-eliminar', params: { plantillaId: props.data.id } },
    icon: "bi-trash"
  },
])
</script>

<template>
  <div class="root">
    <div v-text="data.texto" class="mb-2" />
    <div class="small hstack" style="min-height: 32px;">
      <span class="text-secondary text-opacity-50 fst-italic">
        — {{ data.modified_by }}
      </span>
      <div class="ms-auto">
        <BButton v-for="{ texto, to, icon } in acciones" :to="to" variant="flat-secondary" class="btn-sm">
          <UIcon :name="icon" />
        </BButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  position: relative;
  padding: 0.7em .875em 0.7em 1.5em;
  margin-bottom: 8px;
  border-radius: .6em;
  --bs-border-color: var(--bs-gray-400);
  border: solid 1px var(--bs-border-color);
  transition: all .6s;
}

.root::after {
  position: absolute;
  content: '';
  top: 10px;
  bottom: 10px;
  left: 5px;
  width: 3px;
  border-radius: 4px;
  background-color: var(--bs-yellow-700);
  background-image: var(--bs-gradient) !important;
  transition: all .6s;
}

.root:hover {
  --bs-border-color: var(--bs-gray-500);
}

/* Contenedor de botones */
.root .ms-auto {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0s linear 0.3s;
}

/* Mostrar con delay */
.root:hover .ms-auto {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease, visibility 0s linear 0s;
  transition-delay: 0.3s;
}
</style>
