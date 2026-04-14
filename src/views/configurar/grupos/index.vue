<script setup>
const props = defineProps({
  id: { type: Number, default: null },
  setId: Function,
  crear: Function,
  flows: Object
})

import useGrupos from '@/stores/config-grupos'
import CrearGrupo from '@/views/configurar/grupos/_flows/crear.vue'
import { ref, watch, provide, watchEffect } from 'vue'

const grupos = useGrupos()
const active = ref(null)
watch(active, val => props.setId(val))
watchEffect(() => active.value = props.id)  // source of true is route id
grupos.get()
// provide('gruposTree:active', active)
// onUnmounted(() => grupos.$reset())
// const to = ref({ query: { compose: 'new' } })
</script>

<template>
  <div class="main">
    <div class="border-end px-1 overflow-auto">
      <div class="hstack sticky-top bg-white" style="height: 40px;padding-left: 12px;">
        <span class="small fw-semibold">GRUPOS</span>
        <div class="mx-auto" />
        <BButton @click="crear" variant="primary" v-tippy="'Crear grupo'" class="btn-sm p-1" style="height:32px">
          <UIcon name="bi-plus" font-size="20" />
        </BButton>
      </div>
      <template v-if="grupos.status.loaded">
        <RootTree v-model="active" selectable>
          <TreeNode v-for="data in grupos.data" :data="data" :key="data.id">
            <template #default="{ data }">
              <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
              <span v-text="data.nombre" class="text-truncate" />
            </template>
          </TreeNode>
        </RootTree>
      </template>
    </div>
    <div class="p-1 overflow-auto">
      <router-view />
    </div>
    <CrearGrupo v-if="flows.crear" :back="flows.back" :forward="flows.forward" />
  </div>
</template>

<style scoped>
.main {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 8px;
  overflow: hidden;
}
</style>