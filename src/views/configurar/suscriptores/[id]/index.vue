<script lang="ts" setup>
const props = defineProps({
  suscriptorId: Number
})

import SuscriptorCard from '@/components/features/configurar/suscriptores/SuscriptorCard.vue'
import { useSuscriptorQuery } from '@/stores/suscriptores'
import { computed, provide } from 'vue'

const suscriptorId = computed(() => props.suscriptorId)
const { suscriptor, isLoading } = useSuscriptorQuery(suscriptorId)

provide('suscriptor:suscriptor', suscriptor)
</script>

<template>
  <BOverlay :show="isLoading" variant="transparent" class="h-50">
    <template v-if="suscriptor">
      <BTabs :key="suscriptorId" class="pt-2">
        <BTab title="General">
          <SuscriptorCard />
        </BTab>
      </BTabs>
      <router-view />
    </template>
  </BOverlay>
</template>