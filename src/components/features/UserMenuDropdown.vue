<script lang="ts" setup>
import useAuthUserMenu from '@/composables/useAuthUserMenu'
import { ref } from 'vue'

const { authUser, isImpersonating, actions } = useAuthUserMenu()
const model = ref(false)
const html = ref(`<div class="fw-bold text-start">Cuenta</div><div class="text-truncate text-start text-light">${authUser.value.name}</div>`)
const tippy = ref({
  content: html.value,
  allowHTML: true,
})
</script>

<template>
  <BButton @click="model = true" :active="model" variant="flat-secondary" v-tippy="tippy">
    <img src="@/assets/images/user.png" width="23" class="mb-1">
  </BButton>
  <BDropdown v-if="authUser" v-model="model" no-caret strategy="fixed" @show="tippy.content = ''"
    @hide="tippy.content = html" class="dropdown-toggle-invisible">
    <div class="min-w-340">
      <p v-if="isImpersonating" class="text-center text-danger fw-bold pe-3">
        Personificado
      </p>
      <p class="m-3 mt-2">
        <span class="h5 d-block fw-semibold" v-text="authUser.name" />
        <span class="text-muted" v-text="authUser.username" />
      </p>
      <div class="mx-2">
        <BButton v-for="action in actions" :key="action.title" :to="action.path" variant="flat-primary">
          <UIcon :name="action.icon" />
          {{ action.title }}
        </BButton>
      </div>
    </div>
  </Bdropdown>
</template>