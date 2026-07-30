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