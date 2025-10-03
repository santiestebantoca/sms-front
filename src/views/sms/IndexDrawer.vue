<script setup>
const props = defineProps({ tab: String })

import useColeccionStore from '@/stores/coleccion'
import { ref, watch, watchEffect, onBeforeUnmount } from 'vue'
import useNavOptions from './base/nav'

const nav = useNavOptions().options
const tab = ref(null)
watch(() => props.tab, val => tab.value = val, { immediate: true })
//
const store = useColeccionStore().nav
watchEffect(() => nav.value[1].count = store.data, { immediate: true })
const updateNav = () => store.get()
updateNav()
const interval = setInterval(updateNav, 6000)
//
onBeforeUnmount(() => clearInterval(interval))
</script>

<template>
  <bs-tabs v-model="tab" vertical class="tabs mt-1">
    <bs-tab v-for="{ name, to, icon, label, count } in nav" :name="name" :to="to" @click="$emit('click')">
      <bs-icon :name="icon" fs="22px" />
      <bs-tooltip offset="0,6" placement="bottom"> {{ label }} </bs-tooltip>
      <span v-if="count" class="indicator">
        <span v-text="count" />
      </span>
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

.indicator {
  position: absolute;
  top: 24px;
  left: 28px;
  height: 18px;
  min-width: 18px;
  background-color: orangered;
  border-radius: 9px;
  display: flex;
  justify-content: center;
}

.indicator span {
  color: white;
  font-size: .75em;
}
</style>