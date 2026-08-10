<script setup>
const active = defineModel()
const props = defineProps({
  list: Boolean,
  selectable: Boolean,
  childrenNames: { type: Array, default: [] },
  itemIdName: { type: String, default: 'id' },
})

import { provide, toRef, ref, watchEffect, onMounted, onUnmounted } from 'vue'

const ids = ref(new Set())
const handleNodeClick = id => active.value = id
const mounted = ref(false)

provide('tree:ids', ids)
provide('tree:selectable', toRef(props, 'selectable'))
provide('tree:active', active)
provide('tree:onNodeClick', handleNodeClick)
provide('tree:list', toRef(props, 'list'))
provide('tree:childrenNames', toRef(props, 'childrenNames'))
provide('tree:itemIdName', toRef(props, 'itemIdName'))

watchEffect(() => {
  if (mounted.value) { // Sino hace active = null mientras se genera el Set ids
    if (!ids.value.has(active.value)) active.value = null
  }
})

onMounted(() => mounted.value = true)
onUnmounted(() => active.value = null)
</script>

<template>
  <ul class="m-0 p-0">
    <slot></slot>
  </ul>
</template>