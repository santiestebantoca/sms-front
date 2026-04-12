<script setup>
const props = defineProps({ data: Object, level: { type: Number, default: 0 } })

import { ref, inject, computed } from 'vue'

const list = inject('tree:list')
const childrenNames = inject('tree:childrenNames')
const itemIdName = inject('tree:itemIdName')
const open = ref(false)
const childrenName = computed(() => [...childrenNames.value, 'children'].find(name => props.data.hasOwnProperty(name)))
const leaf = computed(() => !props.data[childrenName.value]?.length)
</script>

<template>
  <TreeItem v-model="open" :level="level" :leaf="leaf" :treeItemId="data[itemIdName]">
    <slot :data="data" :leaf="leaf" />
  </TreeItem>
  <template v-if="!list && !leaf && childrenName">
    <span v-show="open">
      <TreeNode v-for="(child, index) in data[childrenName]" :key="child.id || index" :data="child" :level="level + 1">
        <template #default="{ data, leaf }">
          <slot :data="data" :leaf="leaf" />
        </template>
      </TreeNode>
    </span>
  </template>
</template>