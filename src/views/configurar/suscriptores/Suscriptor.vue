<script setup>
const props = defineProps({ id: Number })

// ✗ Build failed in 1.57s
// error during build:
// [vite: load - fallback] Could not load D: \proyectos\vue - bs\sms\src / stores / config - suscriptores(imported by src / views / configurar / suscriptores / Suscriptor.vue): ENOENT: no such file or directory, open 'D:\proyectos\vue-bs\sms\src\stores\config-suscriptores'
// import useStore from '@/stores/config-suscriptores'
import { computed, watch } from 'vue'

// const store = useStore().suscriptor
// const show = computed(() => store.data?.id === props.id)
// watch(() => props.id, val => store.get(val), { immediate: true })
</script>

<template>
  <div v-if="show">
    <router-view />
  </div>
</template>