<script lang="ts" setup>
import { useMensajesQuery, useMensajesFilter } from '@/stores/mensajes'
import MensajeCard from '@/components/features/mensaje/coleccion/MensajeCard.vue'
import { computed, watchEffect } from 'vue'

const { continua, search, filter } = useMensajesFilter()
const { mensajes, conversaciones, isLoading, query, refresh } = useMensajesQuery()

watchEffect(() => query.value = filter.value)

continua.value = true

const mostrando = computed(() => {
  const m = mensajes.value.length
  const c = Object.keys(conversaciones.value || {}).length
  return `${m} mensaje${m === 1 ? '' : 's'} en ${c} conversaci${c === 1 ? 'ón' : 'ones'}`
})
</script>

<template>
  <div class="root">
    <div class="border-end px-1 overflow-auto">
      <div class="hstack bg-white ps-12 h-40">
        <span class="small fw-semibold">MENSAJES</span>
        <div class="mx-auto" />
      </div>
      <div class="mt-3 ps-12 vstack gap-2">
        <BFormRadio v-model="continua" :value="true"> Pendientes por continuar </BFormRadio>
        <BFormRadio v-model="continua" :value="false"> Enviados en este turno </BFormRadio>
      </div>
    </div>
    <div class="px-1 overflow-auto position-relative">
      <!-- Filters -->
      <div class="filter-section">
        <BSearchInput searchIcon v-model="search" class="max-w-400" />
        <BButton class="me-auto" variant="flat-dark" @click="refresh">
          <UIcon name="bi-arrow-clockwise" /> Actualizar
        </BButton>
        <div v-text="mostrando" class="small fw-semibold text-secondary" />
      </div>
      <!-- SMS List -->
      <div v-for="(values, key) in conversaciones" :key="key"
        class="border-bottom py-3 hstack gap-3 flex-wrap align-items-start">
        <div v-for="value in values" :key="value.id">
          <MensajeCard :data="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
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