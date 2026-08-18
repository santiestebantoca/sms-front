<script lang="ts" setup>
const props = defineProps({
  noLeftButton: Boolean,
  title: { default: "SMS" }
})

import { useNavigationHeader } from '@/composables/useNavigation'
import UserMenu from '@/components/features/UserMenuDropdown.vue'

const { options } = useNavigationHeader()
</script>

<template>
  <BNavbar class="border-bottom">
    <template v-if="!noLeftButton">
      <BButton variant="flat" v-tippy="'Abrir menú de la aplicación'" v-b-toggle.drawer-left class="d-lg-none">
        <UIcon name="bi-list" />
      </BButton>
    </template>
    <BNavbarBrand to="/home">{{ title }}</BNavbarBrand>
    <template v-for="{ label, tooltip, icon, to, id } in options">
      <BButton :to="to" variant="flat-primary" :id="id" v-tippy="tooltip">
        <UIcon :name="icon" />
        {{ label }}
      </BButton>
    </template>
    <span class="ms-auto" />
    <UserMenu />
  </BNavbar>
</template>

<style scoped>
.navbar-brand {
  position: relative;
  top: -1px;
  color: var(--bs-secondary);
}

:deep(.btn) {
  height: 38px;
}
</style>
