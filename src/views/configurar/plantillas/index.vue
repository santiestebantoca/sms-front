<script lang="ts" setup>
const props = defineProps({
  showLista: Boolean,
  plantillaId: Number,
  setPlantillaId: Function,
  linkCrear: Object,
})

import PlantillaCard from '@/components/features/configurar/plantillas/PlantillaCard.vue'
import { usePlantillasQuery } from '@/stores/plantillas'
import { ref, watchEffect } from 'vue'

const { plantillas, search } = usePlantillasQuery()
const active = ref(props.plantillaId)
watchEffect(() => active.value = props.plantillaId)
</script>

<template>
  <div class="container ms-0 ps-4 pb-4">
    <div class="max-w-700">
      <div class="title">
        PLANTILLAS
        <BButton :to="linkCrear" variant="emphasis h-34 py-1" v-tippy="'Crear plantilla'">
          <ILucidePlus /> Agregar
        </BButton>
      </div>
      <div class="py-1">
        <BSearchInput searchIcon v-model="search" class="max-w-400" />
      </div>
      <div class="py-4">
        <PlantillaCard v-for="data in plantillas" :key="data.id" :data="data" />
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  padding: 12px 0;
  font-weight: 600;

  .btn {
    float: right;
    margin: -5px 0;
  }
}
</style>