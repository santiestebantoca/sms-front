<!-- AppIdle.vue (actualizado) -->
<script setup>
class IdleTimer {
  constructor(timeout, warning) {
    this.TIMEOUT = timeout * 60 * 1000
    this.LISTENERS = (timeout / 3) * 60 * 1000
    this.WARNING = timeout * warning * 60 * 1000

    this.heartBeat = () => true
    this.onTimeout = () => true

    this.events = ['mousemove', 'mousedown', 'keydown', 'touchstart']
    this.listenersTimer = null
    this.warningTimer = null
    this.timeoutTimer = null

    this.bindedThrottler = this.throttler.bind(this)

    this.isStarted = false
    this.isListening = false
    this.status = null
  }

  setTimers() {
    this.listenersTimer = setTimeout(() => this.addListeners(), this.LISTENERS)
    this.warningTimer = setTimeout(() => this.warning(), this.WARNING)
    this.timeoutTimer = setTimeout(() => this.timeout(), this.TIMEOUT)
    this.isStarted = true
    this.status = 'repose'
  }

  clearTimers() {
    clearTimeout(this.listenersTimer)
    clearTimeout(this.warningTimer)
    clearTimeout(this.timeoutTimer)
    this.isStarted = false
  }

  warning() {
    this.status = 'warning'
  }

  timeout() {
    this.stop()
    this.status = 'timeout'
    this.onTimeout()
  }

  throttler() {
    this.removeListeners()
    if (this.heartBeat()) this.reset()
    else this.addListeners()
  }

  addListeners() {
    this.events.forEach((event) => {
      window.addEventListener(event, this.bindedThrottler)
    })
    this.isListening = true
    this.status = 'listening'
  }

  removeListeners() {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.bindedThrottler)
    })
    this.isListening = false
  }

  start() {
    !this.isStarted && this.setTimers()
  }

  stop() {
    this.isListening && this.removeListeners()
    this.isStarted && this.clearTimers()
    this.status = null
  }

  reset() {
    if (this.isStarted) {
      this.stop()
      this.start()
    } else this.stop()
  }
}

const props = defineProps({
  timeout: Number,
  warning: Number
})

import { useLastServerAccess } from '@/composables/useLastServerAccess'
import { useAuthStore } from '@/stores/auth'
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const lastServerAccessStore = useLastServerAccess()
const auth = useAuthStore()
const emit = defineEmits(['expired'])

const idleTimer = ref(new IdleTimer(props.timeout, props.warning))

idleTimer.value.heartBeat = () => auth.getAuthUser()
idleTimer.value.onTimeout = () => emit('expired')

const warning = computed(() => idleTimer.value.status === 'warning')

watch(() => auth.auth, auth => {
  if (auth) idleTimer.value.start()
  else idleTimer.value.stop()
})

// ✅ El watch sigue funcionando exactamente igual
watch(() => lastServerAccessStore.lastServerAccess.value, () => {
  idleTimer.value.reset()
})

onBeforeUnmount(() => idleTimer.value.stop())
</script>

<template>
  <BOverlay v-model="warning" :no-wrap="true" blur="2px" variant="dark" opacity="0.6" z-index="1040"
    class="position-fixed top-0 start-0 w-100 h-100" style="pointer-events: none;" />
</template>