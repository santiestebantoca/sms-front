<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import DrawerContent from '@/components/features/DrawerContent.vue'
import useNavigation from '@/composables/useNavigation'

const nav = useNavigation().options
</script>

<template>
  <MainLayout>
    <template #drawer-content="{ down, closeDrawer }">
      <DrawerContent :down="down" :closeDrawer="closeDrawer" :options="nav.componer" />
    </template>
  </MainLayout>
</template>
