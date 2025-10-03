<script setup>
const props = defineProps({ id: Number, setId: Function, compose: Object })

import useGrupos from '@/stores/config-grupos'
import GruposTree from './GruposTree.vue'
import GruposNew from './GruposNew.vue'
import { ref, watch, provide } from 'vue'

const grupos = useGrupos()
const active = ref(props.id) // `id` source of true is `GruposTree`, except on reload 
grupos.get()
watch(active, val => val && props.setId(val)) // can be null on `grupo` deleted
provide('grupos:id', active)
// onUnmounted(() => grupos.$reset())
const to = ref({ query: { compose: 'new' } })
</script>

<template>
  <div class="main">
    <div class="border-end px-1 overflow-auto">
      <div class="hstack sticky-top bg-white" style="height: 40px;padding-left: 12px;">
        <span class="small fw-semibold">GRUPOS</span>
        <div class="mx-auto" />
        <bs-btn-icon :to="to" :round="false" flat color="dark" outline icon="plus-lg" size="24px">
          <bs-tooltip offset="0,10" placement="bottom"> Nuevo Grupo </bs-tooltip>
        </bs-btn-icon>
      </div>
      <template v-if="grupos.status.loaded">
        <GruposTree :data="grupos.data" v-model="active" />
      </template>
    </div>
    <div class="p-1 overflow-auto">
      <router-view />
    </div>
    <GruposNew v-if="compose.new" :back="compose.back" :pertenece="null" />
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