<script lang="ts" setup>
const model = defineModel<boolean>()

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
    <div class="pb-1">
      <div class="hstack py-1 fw-semibold">
        PLANTILLAS
        <BButton variant="flat wh-34" class="ms-auto me-n2" @click="close">
          <ILucideX class="center" />
        </BButton>
      </div>
      <div>
        <BSearchInput v-model="search" />
        <div class="text-end mt-2 small">
          <router-link :to="{ name: 'configurar-plantillas' }" class="text-decoration-none">
            <ILucideSettings class="position-relative mt-n1" />
            Configurar plantillas
          </router-link>
        </div>
      </div>
    </div>
    <!-- List -->
    <div v-if="search?.length < 2" class="text-secondary text-center mt-5">
      <p>
        <ILucideSearch />
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
      <BButton variant="flat border btn-card" v-for="{ texto, id } in plantillas" :key="id"
        @click="$emit('select', texto)" v-tippy="tippy">
        {{ texto }}
      </BButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.widget {
  border-left: solid 1px var(--bs-gray-200);
  overflow-y: scroll;

  .btn-card {
    text-align: start;
    padding-left: calc(13px + 12px);
    position: relative;
    width: 100%;
    margin-bottom: 16px;

    &::after {
      position: absolute;
      content: '';
      top: 10px;
      bottom: 10px;
      left: 5px;
      width: 3px;
      border-radius: 4px;
      background-color: var(--bs-teal);
      background-image: var(--bs-gradient) !important;
      transition: all .6s;
    }
  }
}
</style>