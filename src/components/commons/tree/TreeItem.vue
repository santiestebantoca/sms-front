<script setup>
const open = defineModel()

const props = defineProps({
  treeItemId: Number || String,
  leaf: Boolean,
  level: { type: Number, default: 0 },
  descendantActive: Boolean,
  open: Boolean
})

import { computed, inject } from 'vue'

const onNodeClick = inject('tree:onNodeClick', () => { })
const selectable = inject('tree:selectable')
const active = inject('tree:active')
const list = inject('tree:list')
const isActive = computed(() => active.value && props.treeItemId === active.value)
const rootStyle = computed(() => ({
  '--li-padding-left': list.value ? '8px' : `${14 * props.level + 32}px`,
  ...props.descendantActive && !open.value ? { '--li-bg-color': 'var(--bs-gray-100)' } : {}
}))
//
const handleClick = () => {
  onNodeClick(props.treeItemId)
}
</script>

<template>
  <li class="btn btn-sm fs-6 hstack gap-2" :style="rootStyle" :class="{ active: isActive }"
    v-on="selectable ? { click: handleClick } : {}">
    <template v-if="!leaf">
      <BButton class="btn-x" @click.stop="open = !open" variant="flat-secondary">
        <UIcon v-if="!open" name="bi-chevron-right" font-size="12px" />
        <UIcon v-else name="bi-chevron-down" font-size="12px" />
      </BButton>
    </template>
    <slot></slot>
  </li>
</template>

<style scoped>
li {
  position: relative;
  --li-bg-color: transparent;
  --li-border-color: transparent;
  background-color: var(--li-bg-color) !important;
  border-color: var(--li-border-color) !important;
  padding-left: var(--li-padding-left) !important;
}

li.active,
li:active,
li:hover {
  --li-bg-color: var(--bs-info-50) !important;
}

li.active,
li:active {
  --li-border-color: var(--bs-info-200);
}

/* .collapse */
.btn-x {
  position: absolute;
  top: 5px;
  left: calc(var(--li-padding-left) - 28px) !important;
  padding: 0 4px;
  line-height: normal;
}

.btn-x:hover {
  background-color: transparent !important;
}
</style>
