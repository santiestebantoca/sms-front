<!--
  On the right side there is only the User menu, which is always visible
 -->
<script setup>
const props = defineProps({ noLeftButton: Boolean, title: { default: "SMS" } })

import useNavigation from '@/composables/useNavigation'
import UserWidget from '@/components/features/app/UserDropdown.vue'

const nav = useNavigation().options
</script>

<template>
  <nav class="navbar navbar-expand navbar-light bg-transparent flex-fill border-bottom">
    <div class="container-fluid px-1 align-items-center">
      <template v-if="!noLeftButton">
        <BButton variant="falt-light" v-tippy="'Abrir menú de la aplicación'" v-b-toggle.drawer-left class="d-lg-none">
          <UIcon name="bi-list" />
        </BButton>
      </template>
      <span class="navbar-brand text-truncate ms-1">
        <router-link to="/home" class="link-secondary text-decoration-none" v-text="'SMS'" />
      </span>
      <!-- header actions -->
      <div class="hstack gap-1 px-1">
        <template v-for="{ label, tooltip, icon, to, id } in nav.header">
          <BButton :to="to" variant="flat-primary" :id="id" v-tippy="tooltip">
            <UIcon :name="icon" />
            {{ label }}
          </BButton>
        </template>
      </div>
      <!-- separator -->
      <span class="ms-auto" />
      <!-- right -->
      <div class="collapse navbar-collapse flex-grow-0">
        <!-- header actions -->
        <ul class="navbar-nav">
          <slot name="actions" />
        </ul>
        <!-- header actions Teleport capability -->
        <ul class="navbar-nav" id="app-header-actions" />
        <!-- / -->
        <ul class="navbar-nav">
          <UserWidget />
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  padding-left: 8px;
  padding-right: 8px;
}

.navbar-brand {
  padding: 0;
  position: relative;
  top: -1px;
  color: var(--bs-secondary);
}
</style>
