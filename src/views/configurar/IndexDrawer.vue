<script setup>
const props = defineProps({ tab: String })

import useNavOptions from './base/nav'
import { ref, watch } from 'vue'

const nav = useNavOptions().options
const tab = ref(null)
watch(() => props.tab, val => tab.value = val, { immediate: true })
</script>

<template>
  <bs-tabs v-model="tab" vertical class="tabs mt-1">
    <bs-tab v-for="{ name, to, icon, label } in nav" :name="name" :to="to" @click="$emit('click')">
      <bs-icon :name="icon" fs="22px" />
      <bs-tooltip offset="0,6" placement="bottom"> {{ label }} </bs-tooltip>
    </bs-tab>
  </bs-tabs>
</template>

<style scoped>
:deep(.nav-link) {
  height: 48px;
  padding-top: 8px !important;
  padding-right: 8px !important;
  padding-left: 14px !important;
}
</style>