<!--
 from https://vuejs.org/examples/#tree
  -->
<script setup>
const props = defineProps({ data: Object, level: { type: Number, default: 0 }, leaf: Boolean })

import { ref, computed, inject } from 'vue'

const active = inject('tree:active')
const open = ref(false)
const cls = computed(() => ({
  open: open.value,
  empty: !props.data.children
}))
const showInput = ref(props.leaf
  ? !props.data.children?.length
  : true)
</script>

<template>
  <li :class="cls" class="li li-win">
    <i class="bi-chevron tree-icon align-self-center" @click.stop="open = !open" />
    <input v-if="showInput" type="checkbox" v-model="active" :value="data.id" />
    <bs-icon name="subtract" style="color:var(--bs-yellow)" />
    <span v-text="data.nombre" class="tree-span" />
    <span class="mx-auto" />
  </li>
  <span v-show="open">
    <TreeItemCheckable v-for="data in data.children" :data="data" :level="level + 1" :leaf="leaf" />
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