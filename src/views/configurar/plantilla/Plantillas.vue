<script setup>
const props = defineProps({ id: Number, setId: Function, compose: Object })

import usePlantillas from '@/stores/config-plantillas'
import PlantillasNew from './PlantillasNew.vue'
import { tidy, filter } from '@tidyjs/tidy'
import { ref, computed, provide } from 'vue'

const plantillas = usePlantillas()
const buscar = ref(null)
const buscarLower = computed(() => buscar.value?.toLowerCase())
const buscarDisabled = computed(() => !plantillas.data.length)
const active = ref(props.id) // `id` source of true is this compo, except on reload 
plantillas.get()
// watch(active, val => val && props.setId(val)) // can be null on `plantilla` deleted
provide('plantillas:id', active)
const to = ref({ query: { compose: 'new' } })
//
const dataX = computed(() => plantillas.data.map(d => ({
  ...d,
  edit: { name: 'configurar-plantilla-edit', params: { id: d.id } },
  del: { name: 'configurar-plantilla-del', params: { id: d.id } }
})))
const data = computed(() =>
  tidy(
    dataX.value,
    ...buscar.value ? [filter(d => d.texto.toLowerCase().includes(buscarLower.value))] : [],
  ))
</script>

<template>
  <div class="main">
    <div style="max-width: 800px;padding-left: 1.5rem;">
      <div class="sticky-top">
        <div class="hstack" style="height: 40px;">
          <span class="small fw-semibold">PLANTILLAS</span>
        </div>
        <div class="hstack justify-content-between" style="min-height: 50px;">
          <bs-btn @click="$refs.x.$el.click()" color="primary" flat outline icon="plus-lg" label="Nueva Plantilla" />
          <router-link class="d-none" :to="to" ref="x" />
          <div style="flex-grow:1;max-width: 400px;" class="position-relative">
            <input v-model="buscar" class="form-control form-control-buscar" placeholder="Buscar en las plantillas"
              :disabled="buscarDisabled">
            <div v-if="buscar" class="position-absolute top-50 end-0 translate-middle-y pe-1">
              <bs-btn-icon icon="x-lg" flat size="32px" @click="buscar = null" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="plantillas.status.loaded" class="py-3">
        <ul class="ul">
          <template v-for="d in data">
            <li class="li" :class="{ active: active === d.id }" @click="active = d.id">
              <div v-text="d.texto" class="mb-2" />
              <div class="text-secondary small hstack">
                <span v-text="'Editado por: ' + d.modified_by" />
                <div class="ms-auto">
                  <bs-btn :to="d.edit" icon="pencil" flat color="secondary" size="sm" label="Editar" />
                  <bs-btn :to="d.del" icon="x-lg" flat color="secondary" size="sm" label="Eliminar" />
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <router-view />
      <PlantillasNew v-if="compose.new" :back="compose.back" />
    </div>
  </div>
</template>

<style scoped>
.main {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  overflow: auto;
}

.sticky-top {
  background-color: white;
  box-shadow: 0px 8px 10px 1px white;
}

.form-control-buscar {
  width: 100%;
  box-shadow: none;
}

.form-control-buscar::placeholder {
  color: var(--bs-gray-600);
}

.ul {
  margin: 0;
  padding: 0;
}

.li {
  list-style-type: none;
  padding: 1rem .5rem .5rem;
  --bg-color: transparent;
  --border-color: var(--bs-gray-200);
  background-color: var(--bg-color);
  border-bottom: solid 1px var(--border-color);
}

.li:hover {
  --bg-color: rgba(var(--bs-info-rgb), .05);
}
</style>