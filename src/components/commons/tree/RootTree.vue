<script setup>
const active = defineModel()
const props = defineProps({
  list: Boolean,
  selectable: Boolean,
  childrenNames: { type: Array, default: [] },
  itemIdName: { type: String, default: 'id' },
})

import { provide, toRef, ref, watchEffect } from 'vue'

const ids = ref(new Set())
const handleNodeClick = id => active.value = id

provide('tree:ids', ids)
provide('tree:selectable', toRef(props, 'selectable'))
provide('tree:active', active)
provide('tree:onNodeClick', handleNodeClick)
provide('tree:list', toRef(props, 'list'))
provide('tree:childrenNames', toRef(props, 'childrenNames'))
provide('tree:itemIdName', toRef(props, 'itemIdName'))

watchEffect(() => !ids.value.has(active.value) && (active.value = null))
</script>

<template>
  <ul style="margin: 0;padding: 0;">
    <slot></slot>
  </ul>
</template>