<!-- 
It is a remake of ../grupos/NotificaSel.vue
It is not a dialog and allows one active
-->
<script setup>
const value = defineModel()

import TreeItemCheckable from '../base/TreeItemCheckable.vue'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, watch, provide } from 'vue'

const active = ref([])
provide('tree:active', active)
const grupos = useGrupos()
const data = computed(() => grupos.data)
watch(active, val => {
  if (val.length > 1) active.value = val.slice(1) // keep only last value
  else if (val.length === 1) value.value = val[0]
})
</script>

<template>
  <ul class="ul">
    <TreeItemCheckable v-for="data in data" :data="data" :key="data.id" />
  </ul>
</template>

<style scoped>
:deep(*:not(:hover)>.d-hover) {
  display: none;
}

.ul {
  margin: 0;
  padding: 0;
}

:deep(.li) {
  list-style-type: none;
}

:deep(.li-win) {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

:deep(.li-win:hover) {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

:deep(.li-win.active) {
  --bg-color: rgba(var(--bs-info-rgb), .2);
}

:deep(.li-win.active:hover) {
  --border-color: rgba(var(--bs-info-rgb), .3);
}

:deep(.li) {
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}

:deep(.bi-chevron) {
  font-size: .875em;
  color: var(--bs-secondary);
}

:deep(.bi-chevron:hover) {
  color: var(--bs-primary);
}

:deep(.bi-chevron::before) {
  content: "\f285";
}

:deep(.open>.bi-chevron::before) {
  content: "\f282";
}
</style>