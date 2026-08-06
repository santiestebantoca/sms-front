<script setup>
import AppPresentation from '@/components/features/app/AppPresentation.vue'
import AppGlobalErrors from '@/components/features/app/AppGlobalErrors.vue'
import AppIdle from '@/components/features/app/AppIdle.vue'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { ref, provide } from 'vue'

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md')
provide('app:mobile', mobile)

const defaults = ref({
  BModal: { scrollable: true },
  BPopover: { delay: { show: 500, hide: 5 } },
  BToast: { noProgress: true }
})
</script>

<template>
  <BApp :defaults="defaults">
    <AppPresentation>
      <RouterView />
    </AppPresentation>
    <AppIdle :timeout="1440" :warning="0.7" @expired="$router.push({ name: 'auth-expired' })" />
    <AppGlobalErrors />
  </BApp>
</template>
