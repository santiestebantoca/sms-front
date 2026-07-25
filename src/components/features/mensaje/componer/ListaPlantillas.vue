<script setup>
const model = defineModel()

import { useWidgetPlantillasQuery } from '@/stores/plantillas'
import { ref } from 'vue'

const { plantillas, isLoading, search } = useWidgetPlantillasQuery()
const tippy = ref({
  content: 'Insertar plantilla',
  popperOptions: {
    strategy: 'fixed',
  },
})
const emit = defineEmits(['select'])

const close = () => model.value = false
</script>

<template>
  <div v-if="model" class="widget px-3">
    <!-- Header -->
    <div class="sticky-top pb-1">
      <div class="hstack" style="height: 40px;">
        <span class="small fw-semibold">PLANTILLAS</span>
        <BButton variant="flat-dark" class="ms-auto btn-sm" style="transform: translateX(.5em);" @click="close">
          <UIcon name="bi-x-lg" />
        </BButton>
      </div>
      <div>
        <BSearchInput v-model="search" />
        <div class="text-end mt-2 small">
          <router-link :to="{ name: 'configurar-plantillas' }" class="text-decoration-none">
            <UIcon name="bi-gear" font-size="12px" />
            <span style="position:relative;top:1px"> Configurar plantillas</span>
          </router-link>
        </div>
      </div>
    </div>
    <!-- List -->
    <div v-if="search.length < 2" class="text-secondary text-center mt-5">
      <p>
        <UIcon name="bi-search" />
      </p>
      Escribe al menos 2 caracteres para comenzar a buscar
    </div>
    <div v-else-if="isLoading" class="text-center mt-5">
      <BSpinner />
    </div>
    <div v-else-if="plantillas?.length === 0" class="text-center mt-5">
      No se encontraron plantillas que coincidan con el texto buscado
    </div>
    <div v-else class="py-4">
      <BButton variant="flat-outline-dark" class="btn-card mb-3" v-for="item, index in plantillas" :key="index"
        @click="$emit('select', item.texto)" v-tippy="tippy">
        {{ item.texto }}
      </BButton>
    </div>
  </div>
</template>

<style scoped>
.widget {
  border-left: solid 1px var(--bs-gray-200);
  overflow-y: scroll;
}

.sticky-top {
  background-color: white;
  box-shadow: 0px 8px 10px 1px white;
}

.btn-card {
  text-align: start;
  padding-left: calc(13px + 12px);
  position: relative;
  width: 100%;
}

.btn-card::after {
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
</style>