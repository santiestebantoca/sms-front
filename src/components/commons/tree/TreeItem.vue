<script setup>
const open = defineModel()

const props = defineProps({
  treeItemId: Number || String,
  leaf: Boolean,
  level: { type: Number, default: 0 },
})

import { computed, inject } from 'vue'

const onNodeClick = inject('tree:onNodeClick', () => { })
const selectable = inject('tree:selectable')
const active = inject('tree:active')
const list = inject('tree:list')
const rootStyle = computed(() => ({
  '--li-padding-left': list.value ? '8px' : `${14 * props.level + 32}px`
}))
const isActive = computed(() => active.value && props.treeItemId === active.value)
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
  background-color: var(--li-bg-color) !important;
  padding-left: var(--li-padding-left) !important;
}

li.active,
li:active {
  border-color: var(--bs-info-300) !important;
  --li-bg-color: var(--bs-info-100);
}

li:hover {
  --li-bg-color: var(--bs-info-100);
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
