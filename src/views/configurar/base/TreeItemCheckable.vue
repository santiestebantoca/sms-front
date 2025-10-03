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
  empty: !props.data.children
}))
</script>

<template>
  <!-- <li @click="active = data.id" :class="cls" class="li li-win"> -->
  <li :class="cls" class="li li-win">
    <!-- <label> -->
    <i class="bi-chevron tree-icon align-self-center" @click.stop="open = !open" />
    <input type="checkbox" v-model="active" :value="data.id" />
    <bs-icon name="subtract" style="color:var(--bs-yellow)" />
    <span v-text="data.nombre" class="tree-span" />
    <span class="mx-auto" />
    <!-- </label> -->
  </li>
  <span v-show="open">
    <TreeItemCheckable v-for="data in data.children" :data="data" :level="level + 1" />
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