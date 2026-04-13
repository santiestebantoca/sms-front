<script setup>
import AppPresentation from '@/components/features/app/AppPresentation.vue'
import AppIdle from '@/components/features/app/AppIdle.vue'
// import AppSnackbar from './views/app/AppSnackbar.vue'
// import AppLoading from '@/views/app/AppLoading.vue'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { ref, provide } from 'vue'

const loading = ref(0)
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md') // @media (min-width: 768px)
provide('app:mobile', mobile)
provide('app:loading', loading)
const defaults = ref({
  BModal: {
    scrollable: true,
  },
  BPopover: {
    delay: { show: 500, hide: 5 },
  },
  BToast: {
    noProgress: true,
  },
  BTooltip: {
    delay: { show: 500, hide: 5 },
    tooltipClass: 'tooltip-fade-in-only', // Parece que no funciona con la directiva
    focus: false,
    hover: true,
    placement: 'bottom', // No funciona con la directiva
    offset: 16,
  }
})
</script>

<template>
  <BApp :defaults="defaults">
    <AppPresentation>
      <RouterView />
    </AppPresentation>
    <AppIdle :timeout="1440" :warning="0.7" @expired="$router.push({ name: 'auth-expired' })" />
    <!-- <AppLoading v-if="loading" /> -->
  </BApp>
</template>
