<script setup>
const props = defineProps({
  grupoId: Number,
  setGrupoId: Function,
  flows: Object
})

import { useGruposQuery } from '@/stores/grupos'
import CrearGrupo from '@/views/configurar/grupos/_flows/crear.vue'
import { computed } from 'vue'

const { grupos, isPending } = useGruposQuery()
const active = computed({
  get: () => props.grupoId,
  set: (value) => props.setGrupoId(value)
})
</script>

<template>
  <div class="main">
    <div class="border-end overflow-auto">
      <div class="hstack sticky-top p-1 ps-3">
        <span class="small fw-semibold me-auto">GRUPOS</span>
        <BButton @click="flows.crear.go" variant="primary" v-tippy="'Crear grupo'" class="btn-sm"
          style="height:32px;width: 32px;">
          <UIcon name="bi-plus-lg" />
        </BButton>
      </div>
      <div v-if="isPending" class="mt-5 text-center">
        <BSpinner />
      </div>
      <div v-else class="px-1 py-3">
        <RootTree v-model="active" selectable>
          <TreeNode v-for="item in grupos" :data="item" :key="item.id">
            <template #default="{ data }">
              <UIcon name="bi-subtract" style="flex-shrink:0"
                :style="{ color: data.label === 'origen' ? 'var(--bs-success-400)' : 'var(--bs-yellow)' }" />
              <span v-text="data.nombre" class="text-truncate" />
            </template>
          </TreeNode>
        </RootTree>
      </div>
    </div>
    <div class="overflow-auto px-3 pt-1 pb-4">
      <div v-if="!grupoId" class="mt-5 text-center">
        Seleccione un grupo para mostrarlo aquí.
      </div>
      <router-view v-else />
    </div>
    <CrearGrupo v-if="flows.crear.active" :back="flows.crear.back" :forward="flows.crear.forward" />
  </div>
</template>

<style scoped>
.main {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  /* column-gap: 8px; */
  overflow: hidden;
}

.sticky-top {
  background-color: white;
  box-shadow: 0px 8px 10px 1px white;
}
</style>