<!-- 
data is an array without root object 
-->
<script setup>
const active = defineModel()
const props = defineProps({ data: Array })

import TreeItem from './TreeItem.vue'
import { ref, provide } from 'vue'

provide('tree:active', active)
</script>

<template>
  <ul class="ul">
    <TreeItem v-for="data in data" :data="data" :key="data.id" />
    <!-- <router-link :to="to" class="li li-win text-secondary ">
      <span style="margin-left:20px">(Nuevo)</span>
    </router-link> -->
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