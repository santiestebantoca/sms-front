<script setup>
import useNavigation from '@/composables/useNavigation'

const nav = useNavigation().options
</script>
<template>
  <div class="grid">
    <div style="margin-top: 10%;">
      <h5 class="text-muted mb-3">Configurar</h5>
      <router-link v-for="{ to, label, icon } in nav.configurar" :to="to" class="text-decoration-none d-block py-2">
        <UIcon :name="icon" class="me-2 mb-1" />
        {{ label }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.grid {
  min-height: inherit;
  display: grid;
  grid-template-columns: auto;
  justify-items: center;
}
</style>