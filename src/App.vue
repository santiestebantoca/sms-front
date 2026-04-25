<script setup>
import AppPresentation from '@/components/features/app/AppPresentation.vue'
import AppIdle from '@/components/features/app/AppIdle.vue'
import { useBreakpoints, breakpointsBootstrapV5 } from '@vueuse/core'
import { events } from '@/api/client'
import { ref, provide, onMounted, onUnmounted } from 'vue'

const loading = ref(0)
const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const mobile = breakpoints.smaller('md')
provide('app:mobile', mobile)

const defaults = ref({
  BModal: { scrollable: true },
  BPopover: { delay: { show: 500, hide: 5 } },
  BToast: { noProgress: true }
})

const errorGlobal = ref({
  model: false,
  variant: 'info',
  message: null,
})

const handleError = ({ message, type }) => {
  errorGlobal.value.message = message
  errorGlobal.value.variant = type === 'network' ? 'danger' :
    type === 'server' ? 'warning' : 'info'
  errorGlobal.value.model = 3000
}

onMounted(() => events.on('error', handleError))
onUnmounted(() => events.off('error', handleError))
</script>

<template>
  <BApp :defaults="defaults">
    <AppPresentation>
      <RouterView />
    </AppPresentation>
    <AppIdle :timeout="1440" :warning="0.7" @expired="$router.push({ name: 'auth-expired' })" />
    <!-- <AppLoading v-if="loading" /> -->

    <!-- Errores globales (de Axios) -->
    <Teleport to="body">
      <div class="toast-container position-fixed top-0 end-0 p-3">
        <BToast v-model="errorGlobal.model" :variant="errorGlobal.variant" solid>
          {{ errorGlobal.message }}
        </BToast>
      </div>
    </Teleport>
  </BApp>
</template>
