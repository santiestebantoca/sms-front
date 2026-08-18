<script lang="ts" setup>
import useAuthUserMenu from '@/composables/useAuthUserMenu'
import { ref } from 'vue'

const { authUser, isImpersonating, actions } = useAuthUserMenu()
const model = ref(false)
</script>

<template>
  <BButton @click="model = !model" class="btn-header" variant="flat" v-tippy="'Abrir'>
    <img src="@/assets/images/user.png" width="22" height="22" class="me-2">
    <span class="text-truncate pe-2" v-text="authUser.name" />
    <UIcon name="bi-box-arrow-up-right" class="ms-auto" />
  </BButton>
  <BModal v-model="model" title="Usuario">
    <p v-if="isImpersonating" class="text-center text-danger fw-bold">
      Personificado
    </p>
    <p class="">
      <span class="h5 d-block fw-semibold" v-text="authUser.name" />
      <span class="text-muted" v-text="authUser.username" />
    </p>
    <p class="mb-4">@ <span v-text="authUser.area_nombre" /></p>
    <div>
      <BButton v-for="action in actions" :key="action.title" :to="action.path" variant="flat-primary">
        <UIcon :name="action.icon" />
        {{ action.title }}
      </BButton>
    </div>
  </BModal>
</template>

<style scoped>
.btn-header {
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--bs-gray-700);
}
</style>