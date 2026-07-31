<script setup>
const props = defineProps({
  suscriptorId: Number,
  setSuscriptorId: Function,
  flows: Object
})

import { useSuscriptoresQuery } from '@/stores/suscriptores'
import CrearSuscriptor from '@/views/configurar/suscriptores/_flows/crear.vue'
import { computed } from 'vue'

const { suscriptores, isPending } = useSuscriptoresQuery()
const active = computed({
  get: () => props.suscriptorId,
  set: (value) => props.setSuscriptorId(value)
})
</script>

<template>
  <div class="root">
    <div class="border-end overflow-auto">
      <div class="hstack sticky-top p-1 ps-3">
        <span class="small fw-semibold me-auto">SUSCRIPTORES</span>
        <BButton @click="flows.crear.go" variant="primary" v-tippy="'Crear suscriptor'" class="btn-sm"
          style="height:32px;width: 33px;">
          <UIcon name="bi-plus-lg" />
        </BButton>
      </div>
      <div v-if="isPending" class="mt-5 text-center">
        <BSpinner />
      </div>
      <div v-else class="px-1 py-3">
        <RootTree v-model="active" selectable list>
          <TreeNode v-for="item in suscriptores" :data="item" :key="item.id">
            <template #default="{ data }">
              <UIcon name="bi-person" style="flex-shrink:0;color: var(--bs-success-400)" />
              <span v-text="data.nombre" class="text-truncate" />
              <BBadge v-if="!data.activo" variant="danger">Inactivo</BBadge>
            </template>
          </TreeNode>
        </RootTree>
      </div>
    </div>
    <div class="overflow-auto px-3 pt-1 pb-4">
      <div v-if="!suscriptorId" class="mt-5 text-center">
        Seleccione un suscriptor para mostrarlo aquí.
      </div>
      <router-view v-else />
    </div>
    <CrearSuscriptor v-if="flows.crear.active" :back="flows.crear.back" :forward="flows.crear.forward" />
  </div>
</template>

<style scoped lang="scss">
.root {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  overflow: hidden;

  .sticky-top {
    background-color: white;
    box-shadow: 0px 8px 10px 1px white;
  }
}

// .badge-danger {
//   margin-top: auto;
//   margin-bottom: auto;
//   margin-left: auto;
//   padding: 0 8px;
//   border-radius: 12px;
//   font-weight: 600;
//   font-size: .875em;
//   background-color: var(--bs-danger);
//   color: white;
//   padding-bottom: 2px;
// }
</style>