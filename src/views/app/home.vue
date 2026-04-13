<script setup>
import useNavigation from '@/composables/useNavigation'

const nav = useNavigation().options
</script>
<template>
  <div class="grid">
    <div style="margin-top: 7%;">
      <div class="logo">SMS</div>
      <div class="links">
        <div>
          <h5 class="text-muted mb-3">Mensaje</h5>
          <router-link v-for="{ to, label, icon } in nav.componer" :to="to" class="text-decoration-none d-block py-2">
            <UIcon :name="icon" class="me-2 mb-1" />
            {{ label }}
          </router-link>
        </div>
        <div>
          <h5 class="text-muted mb-3">Configurar</h5>
          <router-link v-for="{ to, label, icon } in nav.configurar" :to="to" class="text-decoration-none d-block py-2">
            <UIcon :name="icon" class="me-2 mb-1" />
            {{ label }}
          </router-link>
        </div>
      </div>
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

.logo {
  font-size: 116px;
  font-weight: bold;
  text-align: center;
  color: var(--bs-gray-300);
  margin-bottom: 24px;
}

.links {
  display: flex;
  gap: 100px;
  justify-content: space-between;
}
</style>