<script setup>
import { iconMap, isValidIcon } from './iconMap.js'

const props = defineProps({
  name: {
    type: String || undefined,
    // required: true,
    validator: (val) => isValidIcon(val) || console.warn(`Icono "${val}" no registrado en UIcon`)
  },
})
</script>

<template>
  <component v-if="props.name" :is="iconMap[props.name]" />
</template>