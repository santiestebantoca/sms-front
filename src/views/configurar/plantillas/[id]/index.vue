<script setup>
// const props = defineProps({ plantillaId: Number, back: Function })

// // import GrupoCard from '@/components/features/configurar/grupos/GrupoCard.vue'
// // import HijosCard from '@/components/features/configurar/grupos/GrupoHijosCard.vue'
// // import SuscriptoresCard from '@/components/features/configurar/grupos/GrupoSuscriptoresCard.vue'
// // import NotificadosCard from '@/components/features/configurar/grupos/GrupoNotificadosCard.vue'
// import { usePlantillaStore } from '@/stores/plantillas'
// import { watchEffect } from 'vue'
// // import { ref, computed, watch, markRaw } from 'vue'

// const plantilla = usePlantillaStore()
// const data = computed(() => plantilla.data)

// watchEffect(() => grupo.get(props.plantillaId))
</script>

<template>
  <!-- <div>
    <div class="text-center p-5" v-if="plantilla.status.loading">
      <BSpinner />
    </div>
    <BTabs v-else-if="data.id === plantillaId">
      {{ plantillaId }}
    </BTabs> -->
  <router-view />
  <!-- </div> -->
</template>

<style scoped>
/* :deep(.nav-link) {
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
} */
</style>