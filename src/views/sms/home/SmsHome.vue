<script setup>
import useNavOptions from '../base/nav'

const nav = useNavOptions().options
</script>
<template>
  <div class="grid">
    <div style="margin-top: 10%;">
      <h5 class="text-muted mb-3">Mensaje</h5>
      <router-link v-for="{ to, label, icon } in nav" :to="to" class="text-decoration-none d-block py-2">
        <bs-icon :name="icon" class="me-2 mb-1" />
        <span v-text="label" />
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
  /* align-content: center; */
}
</style>