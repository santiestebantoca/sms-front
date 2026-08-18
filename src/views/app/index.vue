<script lang="ts" setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderContent from '@/components/features/HeaderContent.vue'
</script>

<template>
  <MainLayout>
    <template #header-content>
      <HeaderContent />
    </template>
    <template #page-content>
      <router-view />
    </template>
  </MainLayout>
</template>
