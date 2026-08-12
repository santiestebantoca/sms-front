<script lang="ts" setup>
const props = defineProps({ flows: Object })

import { usePlantillasQuery } from '@/stores/plantillas'
import PlantillaCard from '@/components/features/configurar/plantillas/PlantillaCard.vue'
import CrearPlantilla from '@/views/configurar/plantillas/_flows/crear.vue'

const { plantillas, search } = usePlantillasQuery()
</script>

<template>
  <div class="root">
    <div class="listado ps-3 pe-1">
      <div class="sticky-top">
        <div class="hstack py-1">
          <span class="small fw-semibold me-auto">PLANTILLAS</span>
          <BButton @click="flows.crear.go" variant="primary" v-tippy="'Crear plantilla'" class="btn-sm h-32">
            <UIcon name="bi-plus-lg" /> Agregar
          </BButton>
        </div>
        <div class="py-1">
          <BSearchInput searchIcon v-model="search" class="max-w-400" />
        </div>
      </div>
      <div class="py-4">
        <PlantillaCard v-for="data in plantillas" :key="data.id" :data="data" />
        <router-view />
      </div>
    </div>
    <CrearPlantilla v-if="flows.crear.active" :back="flows.crear.back" />
  </div>
</template>

<style scoped>
.root {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  overflow: auto;
}

.listado {
  max-width: 700px;
}

.sticky-top {
  background: white;
}

.sticky-top::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  height: 30px;
  pointer-events: none;
  /* Para que no bloquee clics */
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%);
}
</style>