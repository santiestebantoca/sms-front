<script lang="ts" setup>
import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/DrawerContent.vue'
import HeaderContent from '@/components/features/HeaderContent.vue'
import { useNavigationMensaje } from '@/composables/useNavigation'

const { options } = useNavigationMensaje()
</script>

<template>
  <MainLayout>
    <template #header-content>
      <HeaderContent />
    </template>
    <template #page-content>
      <router-view />
    </template>
    <template #drawer-content="{ down, closeDrawer }">
      <DrawerContent :down="down" :closeDrawer="closeDrawer" :options="options" />
    </template>
  </MainLayout>
</template>
