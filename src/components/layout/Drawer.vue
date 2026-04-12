<script setup>
const props = defineProps({
  breakpoint: { type: String, default: 'md' },
  side: { type: String, default: 'left' },
  title: String
})

import { breakpointsBootstrapV5, useBreakpoints } from "@vueuse/core";
import { ref, inject, computed, watch } from 'vue'

const drawerId = ref(`drawer-${props.side}`)

const view = inject('layout:view')
const header = inject('layout:header')
const footer = inject('layout:footer')
const left = inject('layout:left')
const right = inject('layout:right')

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const above = breakpoints.greaterOrEqual(props.breakpoint)
const drawer = ref(null)
watch(above, val => {
  if (val) {
    setTimeout(() => {
      const width = drawer.value?.offsetWidth
      if (props.side == 'left') left.value.width = width
      if (props.side == 'right') right.value.width = width
    }, 100)
  } else {
    if (props.side === 'left') left.value.width = 0
    if (props.side === 'right') right.value.width = 0
  }
}, { immediate: true })
const placement = computed(() => props.side === 'left' ? 'start' : 'end')
const responsive = computed(() => props.breakpoint)
//
const offcanvas = ref(null)
const closeDrawer = () => offcanvas.value = false
// CSS
const rootStyle = computed(() => ({
  '--left-side-top': ['l', 'L'].includes(view.value[0]) ? 0 : `${header.value.height}px`,
  '--right-side-top': ['r', 'R'].includes(view.value[2]) ? 0 : `${header.value.height}px`,
  '--left-side-bottom': ['l', 'L'].includes(view.value[8]) ? 0 : `${footer.value.height}px`,
  '--right-side-bottom': ['r', 'R'].includes(view.value[10]) ? 0 : `${footer.value.height}px`
}))
</script>

<template>
  <div :style="rootStyle" class="drawer" :class="drawerId" ref="drawer">
    <BOffcanvas :id="drawerId" :placement="placement" :responsive="responsive" :title="props.title" v-model="offcanvas">
      <template #header>
        <slot name="header" />
      </template>
      <slot v-bind="{ up: above, down: !above, closeDrawer }" />
    </BOffcanvas>
  </div>
</template>

<style scoped>
.drawer {
  position: fixed;
  width: fit-content;
}

.drawer-left {
  top: var(--left-side-top);
  bottom: var(--left-side-bottom);
  left: 0;
}

.drawer-right {
  top: var(--right-side-top);
  bottom: var(--right-side-bottom);
  right: 0;
}
</style>