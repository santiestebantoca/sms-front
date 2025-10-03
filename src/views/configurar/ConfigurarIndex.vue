<script setup>
const props = defineProps({ tab: String })

import IndexDrawer from './IndexDrawer.vue'
import Header from '@/views/app/AppHeader.vue'
import { ref } from 'vue'

const drawer = ref(null)
</script>

<template>
  <app-layout view="hhh lPr fff">
    <app-header class="bg-white">
      <Header>
        <bs-btn-menu @click="drawer = true" class="my-auto d-xl-none" />
      </Header>
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-drawer v-model="drawer" width="55" breakpoint="xl" v-slot="{ down }" class="border-end">
      <IndexDrawer :down="down" @hide="drawer = false" />
    </app-drawer>
    <app-page-container>
      <app-page>
        <router-view />
      </app-page>
    </app-page-container>
  </app-layout>
</template>
