<script setup>
const props = defineProps({
  grupoId: { type: Number, default: null },
  setGrupoId: Function,
  flows: Object
})

import useGrupos from '@/stores/config-grupos'
import CrearGrupo from '@/views/configurar/grupos/_flows/crear.vue'
import { ref, watch, watchEffect } from 'vue'

const grupos = useGrupos()
const active = ref(null)
watch(active, val => props.setGrupoId(val))
watchEffect(() => active.value = props.grupoId)
grupos.get()
</script>

<template>
  <div class="main">
    <div class="border-end px-1 overflow-auto">
      <div class="hstack sticky-top bg-white" style="height: 40px;padding-left: 12px;">
        <span class="small fw-semibold">GRUPOS</span>
        <div class="mx-auto" />
        <BButton @click="flows.crear.go" variant="primary" v-tippy="'Crear grupo'" class="btn-sm p-1"
          style="height:32px">
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
  column-gap: 8px;
  overflow: hidden;
}
</style>