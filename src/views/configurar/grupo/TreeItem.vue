<!--
 from https://vuejs.org/examples/#tree
  -->
<script setup>
const props = defineProps({ data: Object, level: { type: Number, default: 0 } })

import { ref, computed, inject } from 'vue'

const active = inject('tree:active') // can be null
const open = ref(false)
const cls = computed(() => ({
  open: open.value,
  active: active.value === props.data.id,
  empty: !props.data.children
}))
</script>

<template>
  <li @click="active = data.id" :class="cls" class="li li-win">
    <i class="bi-chevron tree-icon align-self-center" @click.stop="open = !open" />
    <bs-icon name="subtract" style="color:var(--bs-yellow)" />
    <span v-text="data.nombre" class="tree-span text-truncate" />
    <span class="mx-auto" />
  </li>
  <span v-show="open">
    <TreeItem v-for="data in data.children" :data="data" :level="level + 1" />
  </span>
</template>

<style scoped>
li {
  --paddind-times: v-bind(level);
  padding-left: calc(12px * var(--paddind-times) + 4px) !important;
}

.empty>.bi-chevron {
  visibility: hidden;
}
</style>