<script setup>
const model = defineModel()

import { usePlantillasStore } from '@/stores/plantillas'
import { useDebounce } from '@vueuse/core'
import { ref, watch } from 'vue'

const plantillas = usePlantillasStore()
// const show = ref(false)
//
// Buscar (fuera filtros / no es persistente)
const buscar = ref(null)
const debouncedBuscar = useDebounce(buscar, 300)
//
watch(debouncedBuscar, val => {
  if (val) plantillas.get({ texto: val })
  else plantillas.reset()
})
// watch(show, () => buscar.value = null)
const tippy = ref({
  content: 'Click para insertar en el mensaje',
  popperOptions: {
    strategy: 'fixed',
  },
})
//
const emit = defineEmits(['close', 'select'])
const close = () => {
  model.value = false
  emit('close')
}
</script>

<template>
  <div v-if="model" class="widget">
    <!-- Header -->
    <div class="sticky-top pb-1">
      <div class="hstack ps-3 pe-2" style="height: 40px;">
        <span class="small fw-semibold">PLANTILLAS</span>
        <BButton variant="flat-dark" class="ms-auto btn-sm" @click="close">
          <UIcon name="bi-x-lg" />
        </BButton>
      </div>
      <div class="ps-3 pe-3">
        <div style="flex-grow:1;max-width: 400px" class="position-relative">
          <input v-model="buscar" class="form-control" placeholder="Buscar en las plantillas">
          <div v-if="buscar" class="position-absolute top-50 end-0 translate-middle-y pe-1">
            <BButton variant="flat-dark" class="btn-sm" @click="buscar = null" style="height: 30px;">
              <UIcon name="bi-x-lg" font-size="12px" />
            </BButton>
          </div>
        </div>
        <div class="text-end mt-2 small">
          <router-link :to="{ name: 'configurar-plantillas' }" class="text-decoration-none">
            <UIcon name="bi-gear" font-size="12px" />
            <span style="position:relative;top:1px"> Configurar plantillas</span>
          </router-link>
        </div>
      </div>
    </div>
    <!-- List -->
    <div class="p-3">
      <BButton v-for="d, i in plantillas.data" :key="i" variant="warning"
        class="btn-plantilla text-start mb-3 shadow-sm" @click="$emit('select', d.texto)" v-tippy="tippy">
        {{ d.texto }}
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

.btn-warning {
  --bs-btn-border-color: var(--bs-yellow-200);
  --bs-btn-hover-border-color: var(--bs-yellow-600);
  --bs-btn-bg: var(--bs-yellow-200);
  --bs-btn-hover-bg: var(--bs-yellow-200);
  --bs-btn-color: var(--bs-gray-900);
  --bs-btn-padding-y: 0.6rem;
}
</style>