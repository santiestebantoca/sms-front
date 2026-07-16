<script setup>
const props = defineProps({ grupoId: Number, back: Function })

import GrupoCard from '@/components/features/configurar/grupos/GrupoCard.vue'
import HijosCard from '@/components/features/configurar/grupos/GrupoHijosCard.vue'
import SuscriptoresCard from '@/components/features/configurar/grupos/GrupoSuscriptoresCard.vue'
import NotificadosCard from '@/components/features/configurar/grupos/GrupoNotificadosCard.vue'
import { useGrupoExpandidoQuery } from '@/stores/grupos'
import { ref, markRaw, toRef, watchEffect } from 'vue'

const { grupo: data, isPending } = useGrupoExpandidoQuery(toRef(props, 'grupoId'))

watchEffect(() => {
  if (!isPending.value && data.value === undefined) props.back()
})

const tabsData = ref([
  {
    id: 1,
    active: true,
    title: 'General',
    componente: { is: markRaw(GrupoCard), data }
  },
  {
    id: 2,
    title: 'Grupos',
    componente: { is: markRaw(HijosCard), data }
  },
  {
    id: 3,
    title: 'Suscriptores',
    componente: { is: markRaw(SuscriptoresCard), data }
  },
  {
    id: 4,
    title: 'Notificados',
    componente: { is: markRaw(NotificadosCard), data }
  },
])
</script>

<template>
  <div>
    <div v-if="isPending" class="text-center p-5">
      <BSpinner />
    </div>
    <BTabs v-else-if="data.id === grupoId">
      <BTab v-for="tab in tabsData" :key="tab.id" :active="tab.active" :title="tab.title">
        <component :is="tab.componente.is" :data="tab.componente.data" />
      </BTab>
    </BTabs>
    <router-view />
  </div>
</template>

<style scoped>
:deep(.nav-link) {
  border: none !important;
  margin-bottom: 0 !important;
  line-height: normal;
  --bs-nav-tabs-link-active-color: var(--bs-primary);
  position: relative;
  padding-bottom: 12px;
}

:deep(.nav-link::after) {
  display: block;
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  height: 2px;
  width: 100%;
  --up-after-background-color: transparent;
  background-color: var(--up-after-background-color);
  transition: all .3s;
}

:deep(.nav-link.active::after) {
  --up-after-background-color: var(--bs-primary) !important;
}

:deep(.nav-link:hover::after) {
  --up-after-background-color: var(--bs-gray-300);
}
</style>