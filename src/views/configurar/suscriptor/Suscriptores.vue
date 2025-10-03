<script setup>
const props = defineProps({ id: Number, setId: Function, compose: Object })

import useSuscriptores from '@/stores/config-suscriptores'
import useGrupos from '@/stores/config-grupos'
import SuscriptoresNew from './SuscriptoresNew.vue'
import { ref, watch, provide } from 'vue'

const suscriptores = useSuscriptores()
const active = ref(props.id) // `id` source of true is this compo, except on reload 
suscriptores.get()
useGrupos().get() // UX
watch(active, val => val && props.setId(val)) // can be null on `grupo` deleted
provide('suscriptores:id', active)
const to = ref({ query: { compose: 'new' } })
</script>

<template>
  <div class="main">
    <div class="border-end px-1 overflow-auto">
      <div class="hstack sticky-top bg-white" style="height: 40px;padding-left: 12px;">
        <span class="small fw-semibold">SUSCRIPTORES</span>
        <div class="mx-auto" />
        <bs-btn-icon :to="to" :round="false" flat color="dark" outline icon="plus-lg" size="24px">
          <bs-tooltip offset="0,10" placement="bottom"> Nuevo Suscriptor </bs-tooltip>
        </bs-btn-icon>
      </div>
      <template v-if="suscriptores.status.loaded">
        <ul class="ul">
          <template v-for="d in suscriptores.data">
            <li class="li li-win" :class="{ active: active === d.id }" @click="active = d.id">
              <i class="bi-person-fill text-secondary mx-1" />
              <span v-text="d.nombre" class="tree-span text-truncate" />
              <span v-if="!d.activo" class="badge-danger"> inactivo </span>
            </li>
          </template>
        </ul>
      </template>
    </div>
    <div class="p-1 overflow-auto">
      <router-view />
    </div>
    <SuscriptoresNew v-if="compose.new" :back="compose.back" />
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

.ul {
  margin: 0;
  padding: 0;
}

.li {
  list-style-type: none;
  --paddind-times: 0;
  padding-left: calc(12px * var(--paddind-times) + 4px) !important;
}

.li.level-1 {
  --paddind-times: 1;
}

.li-win {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

.li-win:hover {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

.li-win.active {
  --bg-color: rgba(var(--bs-info-rgb), .2);
}

.li-win.active:hover {
  --border-color: rgba(var(--bs-info-rgb), .3);
}

.li {
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}

.badge-danger {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  padding: 0 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: .875em;
  background-color: var(--bs-danger);
  color: white;
  padding-bottom: 2px;
}
</style>