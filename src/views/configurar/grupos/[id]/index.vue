<script lang="ts" setup>
const props = defineProps({ grupoId: Number })

import GrupoCard from '@/components/features/configurar/grupos/GrupoCard.vue'
import HijosCard from '@/components/features/configurar/grupos/GrupoHijosCard.vue'
import SuscriptoresCard from '@/components/features/configurar/grupos/GrupoSuscriptoresCard.vue'
import NotificadosCard from '@/components/features/configurar/grupos/GrupoNotificadosCard.vue'
import { useGrupoQuery } from '@/stores/grupos'
import { computed, provide } from 'vue';

const grupoId = computed(() => props.grupoId)
const { grupo, isLoading } = useGrupoQuery(grupoId)

provide('grupo:grupo', grupo)
</script>

<template>
  <BOverlay :show="isLoading" variant="transparent" class="h-50">
    <template v-if="grupo">
      <BTabs :key="grupoId" class="pt-2">
        <BTab title="General">
          <GrupoCard />
        </BTab>
        <BTab title="Grupos" lazy>
          <HijosCard />
        </BTab>
        <BTab title="Suscriptores" lazy>
          <SuscriptoresCard />
        </BTab>
        <BTab title="Notificados" lazy>
          <NotificadosCard />
        </BTab>
      </BTabs>
      <router-view />
    </template>
  </BOverlay>
</template>