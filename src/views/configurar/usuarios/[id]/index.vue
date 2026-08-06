<script setup>
const props = defineProps({ usuarioId: Number })

import UsuarioCard from '@/components/features/configurar/usuarios/UsuarioCard.vue'
import RolesCard from '@/components/features/configurar/usuarios/UsuarioRolesCard.vue'
</script>

<template>
  <BTabs :key="usuarioId" small>
    <BTab title="General">
      <UsuarioCard :usuarioId="usuarioId" />
    </BTab>
    <BTab title="Roles" lazy>
      <RolesCard :usuarioId="usuarioId" />
    </BTab>
  </BTabs>
  <router-view />
</template>