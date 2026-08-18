<script lang="ts" setup>
const props = defineProps({
  breakpoint: { type: String, default: 'md' },
  side: { type: String, default: 'left' },
  title: String
})

import { breakpointsBootstrapV5, useBreakpoints } from "@vueuse/core"
import { ref, inject, computed, watch } from 'vue'

const drawerId = ref(`drawer-${props.side}`)
const view = inject<import('vue').ComputedRef<string>>('layout:view', computed(() => ''))
const header = inject<import('vue').Ref<{ height: number; left: number; right: number; stopShadowOnScroll: boolean }>>('layout:header', ref({ height: 0, left: 0, right: 0, stopShadowOnScroll: true }))
const footer = inject<import('vue').Ref<{ height: number; left: number; right: number }>>('layout:footer', ref({ height: 0, left: 0, right: 0 }))
const left = inject<import('vue').Ref<{ width: number; top: number; bottom: number }>>('layout:left', ref({ width: 0, top: 0, bottom: 0 }))
const right = inject<import('vue').Ref<{ width: number; top: number; bottom: number }>>('layout:right', ref({ width: 0, top: 0, bottom: 0 }))
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const above = breakpoints.greaterOrEqual(props.breakpoint as keyof typeof breakpointsBootstrapV5)
const offcanvas = ref(null)
const model = ref(undefined)
const rootClass = ref([])
const placement = computed(() => props.side === 'left' ? 'start' : 'end')

watch(above, above => {
  if (above) { // Posiciona el drawer segun view y actualiza variables de layout
    if ((props.side === 'left') && ['l', 'L'].includes(view.value[4])) {
      rootClass.value = ['d-fixed', 'start-0']
      left.value.width = offcanvas.value?.offsetWidth
    } else if ((props.side === 'right') && (['r', 'R'].includes(view.value[6]))) {
      rootClass.value = ['d-fixed', 'end-0']
      right.value.width = offcanvas.value?.offsetWidth
    } else {
      rootClass.value = ['d-none']
      if (props.side === 'left') left.value.width = 0
      else if (props.side === 'right') right.value.width = 0
    }
    offcanvas.value?.hide() // Asegura que no esté visible cuando, estando abierto, se amplía y se reduce el viewport
  } else { // Deja el control al offcanvas
    rootClass.value = []
    if (props.side === 'left') left.value.width = 0
    else if (props.side === 'right') right.value.width = 0
  }
}, { immediate: true })
// CSS
const rootStyle = computed(() => ({
  '--left-side-top': ['l', 'L'].includes(view.value[0]) ? 0 : `${header.value.height}px`,
  '--left-side-bottom': ['l', 'L'].includes(view.value[8]) ? 0 : `${footer.value.height}px`,
  '--right-side-top': ['r', 'R'].includes(view.value[2]) ? 0 : `${header.value.height}px`,
  '--right-side-bottom': ['r', 'R'].includes(view.value[10]) ? 0 : `${footer.value.height}px`
}))
</script>

<template>
  <div :style="rootStyle" class="root" :class="rootClass">
    <BOffcanvas :id="drawerId" :placement="placement" :responsive="breakpoint" :title="props.title" v-model="model"
      ref="offcanvas" style="--bs-offcanvas-width: fit-content">
      <template #header>
        <slot name="header" />
      </template>
      <slot v-bind="{ up: above, down: !above, closeDrawer: offcanvas?.hide }" />
    </BOffcanvas>
  </div>
</template>

<style scoped>
.root {
  top: var(--left-side-top);
  bottom: var(--left-side-bottom);
}
</style>