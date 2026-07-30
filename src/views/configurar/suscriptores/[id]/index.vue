<script setup>
const props = defineProps({ suscriptorId: Number, back: Function })

import SuscriptorCard from '@/components/features/configurar/suscriptores/SuscriptorCard.vue'
import SuscriptorMetaCard from '@/components/features/configurar/suscriptores/SuscriptorMetaCard.vue'
import { useSuscriptorQuery } from '@/stores/suscriptores'
import { ref, markRaw, watchEffect } from 'vue'

const { suscriptor, isPending, suscriptorId } = useSuscriptorQuery()

watchEffect(() => suscriptorId.value = props.suscriptorId)
watchEffect(() => {
  if (!isPending.value && suscriptor.value === undefined) props.back()
})

const tabsData = ref([
  {
    id: 1,
    active: true,
    title: 'General',
    componente: { is: markRaw(SuscriptorCard), data: suscriptor }
  },
  {
    id: 2,
    title: 'Meta',
    componente: { is: markRaw(SuscriptorMetaCard), data: suscriptor }
  },
])
</script>

<template>
  <div>
    <div v-if="isPending" class="text-center p-5">
      <BSpinner />
    </div>
    <BTabs v-else-if="suscriptor.id === suscriptorId">
      <BTab v-for="tab in tabsData" :key="tab.id" :active="tab.active" :title="tab.title">
        <component :is="tab.componente.is" :data="tab.componente.data" />
      </BTab>
    </BTabs>
    <router-view />
  </div>
</template>