<script lang="ts" setup>
const props = defineProps({
  noLeftButton: Boolean,
  title: { default: "SMS" }
})

import { useNavigationHeader } from '@/composables/useNavigation'
import UserMenu from '@/components/features/UserMenuDropdown.vue'
import { inject } from 'vue'

const { options } = useNavigationHeader()
const mobile = inject('app:mobile')
</script>

<template>
  <BNavbar class="border-bottom px-md-3">
    <template v-if="!noLeftButton && mobile">
      <BButton variant="flat wh-34 ms-n1 me-1" v-tippy="'Abrir menú de la aplicación'" v-b-toggle.drawer-left>
        <ILucideMenu class="center" />
      </BButton>
    </template>
    <BNavbarBrand to="/home" class="brand" :class="{ 'fs-6 fw-semibold': mobile }">
      {{ title }}
    </BNavbarBrand>
    <template v-for="{ label, tooltip, icon, to, id } in options">
      <BButton :to="to" variant="link" :id="id" v-tippy="tooltip">
        <UIcon :name="icon" />
        {{ label }}
      </BButton>
    </template>
    <span class="ms-auto" />
    <UserMenu />
  </BNavbar>
</template>

<style scoped>
.brand {
  position: relative;
  top: -1px;
}
</style>