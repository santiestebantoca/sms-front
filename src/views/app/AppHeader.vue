<!--
  On the right side there is only the User menu, which is always visible
 -->
<script setup>
const props = defineProps({ title: { default: "SMS" } })

import useNavOptions from './base/nav'
import UserWidget from '@/views/app/widgets/user/Dropdown.vue'
import { computed } from 'vue'

const nav = computed(() => useNavOptions().options.value.header)
</script>

<template>
  <nav class="navbar navbar-expand navbar-light bg-transparent flex-fill border-bottom">
    <slot />
    <div class="container-fluid px-1 align-items-center">
      <span class="navbar-brand text-truncate ms-1">
        <router-link to="/home" class="link-secondary text-decoration-none" v-text="'SMS'" />
      </span>
      <!-- header actions -->
      <div class="hstack gap-1 px-1">
        <bs-btn v-for="{ label, tooltip, icon, to } in nav" :to="to" :label="label" :icon="icon" flat color="primary">
          <bs-tooltip offset="0,10" placement="bottom">{{ tooltip }}</bs-tooltip>
        </bs-btn>
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
