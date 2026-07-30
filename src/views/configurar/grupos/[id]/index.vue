<script setup>
const props = defineProps({ grupoId: Number, back: Function })

import GrupoCard from '@/components/features/configurar/grupos/GrupoCard.vue'
import HijosCard from '@/components/features/configurar/grupos/GrupoHijosCard.vue'
import SuscriptoresCard from '@/components/features/configurar/grupos/GrupoSuscriptoresCard.vue'
import NotificadosCard from '@/components/features/configurar/grupos/GrupoNotificadosCard.vue'
</script>

<template>
  <BTabs :key="grupoId" small>
    <BTab title="General">
      <GrupoCard :grupoId="grupoId" />
    </BTab>
    <BTab title="Grupos" lazy>
      <HijosCard :padreId="grupoId" />
    </BTab>
    <BTab title="Suscriptores" lazy>
      <SuscriptoresCard :grupoId="grupoId" />
    </BTab>
    <BTab title="Notificados" lazy>
      <NotificadosCard :grupoId="grupoId" />
    </BTab>
  </BTabs>
  <router-view />
</template>