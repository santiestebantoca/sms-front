<script setup>
import { useNavigationMensaje } from '@/composables/useNavigation'

const { options } = useNavigationMensaje()
</script>
<template>
  <div class="grid">
    <div class="shift">
      <h5 class="text-muted mb-3">Mensaje</h5>
      <router-link v-for="{ to, label, icon } in options" :to="to" class="text-decoration-none d-block py-2">
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

.shift {
  margin-top: 10%;
}
</style>