<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/DrawerContent.vue'
import { useNavigationMensaje } from '@/composables/useNavigation'

const navMensaje = useNavigationMensaje().options
</script>

<template>
  <MainLayout>
    <template #drawer-content="{ down, closeDrawer }">
      <DrawerContent :down="down" :closeDrawer="closeDrawer" :options="navMensaje" />
    </template>
  </MainLayout>
</template>
