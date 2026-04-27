<script setup>
const props = defineProps({
  data: Object,
  level: { type: Number, default: 0 },
  filtro: { type: Function, default: () => true }
})

import { ref, inject, computed, watch, watchEffect } from 'vue'

const list = inject('tree:list')
const childrenNames = inject('tree:childrenNames')
const itemIdName = inject('tree:itemIdName')
const active = inject('tree:active')
const open = ref(false)
const childrenName = computed(() => [...childrenNames.value, 'children'].find(name => props.data.hasOwnProperty(name)))
const leaf = computed(() => !props.data[childrenName.value]?.length)
const descendantIds = computed(() => getAllNodeIds(props.data))
const isDescendantActive = computed(() => active.value && descendantIds.value.some(d => d === active.value))
//
function getAllNodeIds(node) {
  let ids = []
  function traverse(node) {
    if (node[itemIdName.value] !== undefined) ids.push(node[itemIdName.value])
    if (node[childrenName.value] && node[childrenName.value].length)
      node[childrenName.value].forEach(child => traverse(child))
  }
  traverse(node)
  return ids.slice(1)
}
const show = ref(false)
watchEffect(() => show.value = props.filtro(props.data))
</script>

<template>
  <TreeItem v-if="show" v-model="open" :level="level" :leaf="leaf" :treeItemId="data[itemIdName]"
    :descendantActive="isDescendantActive" :open="open">
    <slot :data="data" :leaf="leaf" />
  </TreeItem>
  <template v-if="show && !list && !leaf && childrenName">
    <span v-show="open">
      <TreeNode v-for="(child, index) in data[childrenName]" :key="child[itemIdName] || index" :data="child"
        :level="level + 1" :filtro="filtro">
        <template #default="{ data, leaf }">
          <slot :data="data" :leaf="leaf" />
        </template>
      </TreeNode>
    </span>
  </template>
</template>