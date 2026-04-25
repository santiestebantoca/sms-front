<script setup>
import { toSQLString } from '@/composables/useDates'
import { useSmssStore, useSmssFiltrosStore } from '@/stores/smss'
import MensajeCard from '@/components/features/sms/coleccion/MensajeCard.vue'
import { tidy, filter, groupBy } from '@tidyjs/tidy'
import { useDebounce } from '@vueuse/core'
import { ref, computed, watch } from 'vue'

const smss = useSmssStore()
const filtros = useSmssFiltrosStore()
filtros.continua = true
const selection = computed({
  get() {
    return filtros.continua ? 'continua' : 'turno'
  },
  set(newValue) {
    if (newValue === 'continua') {
      filtros.continua = true
      filtros.desde = null
      filtros.hasta = null
    } else {
      const ahora = new Date()
      const empieza = new Date()
      const ayer = empieza.getHours() < 8
      empieza.setDate(empieza.getDate() - (ayer ? 1 : 0))
      empieza.setHours(8, 0, 0, 0)
      ahora.setHours(23, 59, 59, 0)
      filtros.continua = null
      filtros.desde = toSQLString(empieza)
      filtros.hasta = toSQLString(ahora)
    }
  }
})
//
// Buscar (fuera filtros / no es persistente)
const buscar = ref(null)
const debouncedBuscar = useDebounce(buscar, 300)
const buscarLower = computed(() => debouncedBuscar.value?.toLowerCase())
const buscarDisabled = computed(() => !smss.data.length)
//
// Data:: transform y filtro Buscar
const data = computed(() =>
  tidy(
    smss.data,
    ...buscarLower.value ? [filter(d => d.texto.toLowerCase().includes(buscarLower.value))] : [],
    groupBy('subgrupo', [], groupBy.entriesObject())
  ))

const mostrando = computed(() => {
  if (buscar.value) {
    const m = data.value.reduce((a, d) => a + d.values.length, 0)
    return `${m} mensaje${m === 1 ? ' filtrado' : 's filtrados'}`
  } else {
    const m = smss.data.length
    const c = data.value.length
    return `${m} mensaje${m === 1 ? '' : 's'} en ${c} conversaci${c === 1 ? 'ón' : 'ones'}`
  }
})
</script>

<template>
  <div class="main">
    <div class="border-end px-1 overflow-auto">
      <div class="hstack bg-white ps-12" style="height: 40px">
        <span class="small fw-semibold">MENSAJES</span>
        <div class="mx-auto" />
      </div>
      <div class="mt-3 ps-12 vstack gap-2">
        <BFormRadio v-model="selection" value="continua"> Pendientes por continuar </BFormRadio>
        <BFormRadio v-model="selection" value="turno"> Enviados en este turno </BFormRadio>
      </div>
    </div>
    <div class="px-1 overflow-auto position-relative">
      <!-- Filters -->
      <div class="filter-section">
        <div style="flex-grow:1;max-width: 400px;" class="position-relative">
          <input v-model="buscar" class="form-control" placeholder="Buscar en los mensajes" :disabled="buscarDisabled">
          <div v-if="buscar" class="position-absolute top-50 end-0 translate-middle-y pe-1">
            <BButton variant="flat-dark" class="btn-sm" @click="buscar = null">
              <UIcon name="bi-x-lg" />
            </BButton>
          </div>
        </div>
        <BButton class="me-auto" variant="flat-dark" @click="smss.get">
          <UIcon name="bi-arrow-clockwise" /> Actualizar
        </BButton>
        <div v-text="mostrando" class="small fw-semibold text-secondary" />
      </div>
      <!-- SMS List -->
      <div v-for="{ key, values } in data" :key="key"
        class="border-bottom py-3 hstack gap-3 flex-wrap align-items-start">
        <div v-for="value in values" :key="value.id">
          <MensajeCard :data="value" />
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
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
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
</style>