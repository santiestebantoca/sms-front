<script lang="ts" setup>
import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/DrawerContent.vue'
import { useNavigationMensaje } from '@/composables/useNavigation'

const { options } = useNavigationMensaje()
</script>

<template>
  <MainLayout>
    <template #drawer-content="{ down, closeDrawer }">
      <DrawerContent :down="down" :closeDrawer="closeDrawer" :options="options" />
    </template>
  </MainLayout>
</template>
