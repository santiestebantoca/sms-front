<script setup>
const props = defineProps({ id: Number })

import useStore from '@/stores/config-users'
import { computed, watch } from 'vue'

const store = useStore().user
const show = computed(() => store.data?.id === props.id)
watch(() => props.id, val => store.get(val), { immediate: true })
</script>

<template>
  <div v-if="show">
    <router-view />
  </div>
</template>