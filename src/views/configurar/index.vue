<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/DrawerContent.vue'
import { useNavigationConfigurar } from '@/composables/useNavigation'

const { options } = useNavigationConfigurar()
</script>

<template>
  <MainLayout>
    <template #drawer-content="{ down, closeDrawer }">
      <DrawerContent :down="down" :closeDrawer="closeDrawer" :options="options" />
    </template>
  </MainLayout>
</template>