<script lang="ts" setup>
const props = defineProps({ suscriptorId: Number })

import SuscriptorCard from '@/components/features/configurar/suscriptores/SuscriptorCard.vue'
</script>

<template>
  <BTabs :key="suscriptorId" small>
    <BTab title="General">
      <SuscriptorCard :suscriptorId="suscriptorId" />
    </BTab>
  </BTabs>
  <router-view />
</template>