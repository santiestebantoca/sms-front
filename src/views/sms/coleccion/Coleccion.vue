<!-- 
Filter options
Mi turno: mensaje.de = me, mensaje.en = (today, yesterday, before yesterday)
-->
<script setup>
import { toSQLString } from '@/use/useDates'
import useColeccionStore from '@/stores/coleccion'
import Card from './MensajeCard.vue'
import { tidy, filter, groupBy } from '@tidyjs/tidy'
import { ref, computed, watch } from 'vue'

const coleccion = useColeccionStore()
const buscar = ref(null)
const buscarLower = computed(() => buscar.value?.toLowerCase())
const buscarDisabled = computed(() => !coleccion.data.length)
const selection = ref('continua')
const updateQuery = () => {
  if (selection.value === 'continua')
    coleccion.query = { continua: true }
  else {
    const ahora = new Date()
    const empieza = new Date()
    const ayer = empieza.getHours() < 8
    empieza.setDate(empieza.getDate() - (ayer ? 1 : 0))
    empieza.setHours(8, 0, 0, 0)
    ahora.setHours(23, 59, 59, 0)
    coleccion.query = {
      desde: toSQLString(empieza),
      hasta: toSQLString(ahora)
    }
  }
}
watch(selection, updateQuery, { immediate: true })
// Data:: transform
const data = computed(() =>
  tidy(
    coleccion.data,
    ...buscar.value ? [filter(d => d.texto.toLowerCase().includes(buscarLower.value))] : [],
    groupBy('subgrupo', [], groupBy.entriesObject())
  ))
//
const mostrando = computed(() => {
  if (buscar.value) {
    const m = data.value.reduce((a, d) => a + d.values.length, 0)
    return `${m} mensaje${m === 1 ? ' filtrado' : 's filtrados'}`
  } else {
    const m = coleccion.data.length
    const c = data.value.length
    return `${m} mensaje${m === 1 ? '' : 's'} en ${c} conversaci${c === 1 ? 'ón' : 'ones'}`
  }
})
//

// Pagination
// const pagination = computed(() => coleccion.page.text)
// const btnDown = computed(() => ({
//   action: () => {
//     coleccion.page.prev()
//     coleccion.get()
//   },
//   disable: coleccion.page.prevDisabled
// }))
// const btnUp = computed(() => ({
//   action: () => {
//     coleccion.page.next()
//     coleccion.get()
//   },
//   disable: coleccion.page.nextDisabled
// }))
</script>

<template>
  <div class="main">
    <div class="border-end px-1 overflow-auto">
      <div class="hstack sticky-top bg-white ps-12" style="height: 40px">
        <span class="small fw-semibold">MENSAJES</span>
        <div class="mx-auto" />
      </div>
      <div class="mb-2 ps-12">
        <div class="d-inline-block">
          <bs-radio label="Por continuar" v-model="selection" compact value="continua" />
          <bs-tooltip placement="bottom" offset="88,10">
            Todos los mensajes pendientes por continuar
          </bs-tooltip>
        </div>
      </div>
      <div class="mb-3 ps-12">
        <div class="d-inline-block">
          <bs-radio label="Del turno" v-model="selection" compact value="turno" />
          <bs-tooltip placement="bottom" offset="65,10">
            Mensajes enviados en este turno
          </bs-tooltip>
        </div>
      </div>
    </div>
    <div class="px-1 overflow-auto">
      <!-- Filters -->
      <div class="sticky-top filter-section">
        <div style="flex-grow:1;max-width: 400px;" class="position-relative">
          <input v-model="buscar" class="form-control form-control-buscar" placeholder="Buscar en los mensajes"
            :disabled="buscarDisabled">
          <div v-if="buscar" class="position-absolute top-50 end-0 translate-middle-y pe-1">
            <bs-btn-icon icon="x-lg" flat size="32px" @click="buscar = null" />
          </div>
        </div>
        <bs-btn class="me-auto" flat style="padding-left:34px" @click="updateQuery">
          <bs-icon name="arrow-clockwise" fs="21px" style="position:absolute;left:8px;top:8px" />
          Actualizar
          <bs-tooltip offset="0,10" placement="bottom"> Actualizar </bs-tooltip>
        </bs-btn>
        <div v-text="mostrando" class="small fw-semibold text-secondary" />
      </div>
      <!-- Idea from: D:\proyectos\vue-bs\dar\src\views\admin\user\AdminUsersGrid.vue -->
      <!-- Responsive grid -->
      <div class="add-pagination-grid mt-1 mb-2">
        <!-- Front filters (key words) and ordering -->
        <div class="add-grid-item"> </div>
        <!-- Pagination -->
        <!-- <div class="hstack pag-grid-item" style="height: 38px;">
          <span class="small text-muted ms-auto me-2" v-text="pagination" />
          <bs-btn-pg-down :disable="btnDown.disable" @click="btnDown.action()" />
          <bs-btn-pg-up :disable="btnUp.disable" @click="btnUp.action()" />
        </div> -->
      </div>
      <!-- SMS List -->
      <div v-for="{ key, values } in data" :key="key"
        class="border-bottom py-3 hstack gap-3 flex-wrap align-items-start">
        <div v-for="value in values" :key="value.id">
          <Card :data="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  height: 100%;
  display: grid;
  grid-template-columns: 260px 1fr;
  column-gap: 8px;
  overflow: hidden;
}

.ps-12 {
  padding-left: 12px;
}

.filter-section {
  margin: 0 -4px;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  min-height: 50px;
  align-items: baseline;
  background-color: white;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 4px;
  box-shadow: 0px 8px 10px 1px white;
}

.form-control-buscar {
  box-shadow: none;
}

.form-control-buscar::placeholder {
  color: var(--bs-gray-600);
}
</style>