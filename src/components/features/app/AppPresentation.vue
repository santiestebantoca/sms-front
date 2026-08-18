<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const navigation = ref((performance.getEntriesByType('navigation') as PerformanceNavigationTiming[])
  .some(d => d.type === 'navigate'))
onMounted(() => setTimeout(() => navigation.value = false, 3000))
</script>

<template>
  <div v-if="navigation" class="vh-100 d-flex align-items-center">
    <h3 class="mx-auto shimmer-text">SMS</h3>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
.shimmer-text {
  font-size: 1.8em;
  font-weight: 600;
  background: linear-gradient(90deg,
      #1a2a4a 0%,
      #1a2a4a 30%,
      #4a7ab5 50%,
      #1a2a4a 70%,
      #1a2a4a 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer 2.5s ease-in-out infinite;
  letter-spacing: 4px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>