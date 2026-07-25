<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/DrawerContent.vue'
import { useNavigationConfigurar } from '@/composables/useNavigation'

const navConfigurar = useNavigationConfigurar().options
</script>

<template>
  <MainLayout>
    <template #drawer-content="{ down, closeDrawer }">
      <DrawerContent :down="down" :closeDrawer="closeDrawer" :options="navConfigurar" />
    </template>
  </MainLayout>
</template>