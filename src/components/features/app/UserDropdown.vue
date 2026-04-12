<script setup>
import useAuthUserMenu from '@/composables/useAuthUserMenu'
import { ref } from 'vue'

const { user, isImpersonating, actions } = useAuthUserMenu()

const html = ref(`<div class="fw-bold text-start">Cuenta</div><div class="text-truncate text-start text-light">${user.value.name}</div>`)
const tippy = ref({
  content: html.value,
  allowHTML: true,
})
</script>

<template>
  <BDropdown v-if="user" variant="link" no-caret strategy="fixed" v-tippy="tippy" @show="tippy.content = ''"
    @hide="tippy.content = html">
    <template #button-content>
      <img src="@/assets/images/user2.png" width="22" height="22" tippy="`Abrir menú del usuario (${user.name})`">
    </template>
    <div style="min-width:340px">
      <p v-if="isImpersonating" class="text-center text-danger fw-bold pe-3">
        Personificado
      </p>
      <p class="m-3 mt-2">
        <span class="h5 d-block fw-semibold" v-text="user.name" />
        <span class="text-muted" v-text="user.username" />
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