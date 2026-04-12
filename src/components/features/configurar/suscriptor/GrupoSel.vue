<!-- 
It is a remake of ../grupos/NotificaSel.vue
It is not a dialog and allows one active
-->
<script setup>
const value = defineModel()

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
  <ul class="ul ul-tree">
    <!-- <TreeItemCheckable v-for="data in data" :data="data" :key="data.id" /> -->
  </ul>
</template>