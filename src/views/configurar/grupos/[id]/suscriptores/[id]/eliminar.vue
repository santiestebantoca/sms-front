<script setup>
const props = defineProps({ grupoId: Number, suscriptorId: Number, back: Function })

import { useConfigGrupoStore, useConfigGrupoSuscriptoresStore } from '@/stores/config-grupos'
import { ref, computed } from 'vue'

const model = ref(true)
const grupo = useConfigGrupoStore()
const suscriptores = useConfigGrupoSuscriptoresStore()
const data = computed(() => grupo.data.suscriptores?.find(d => d.id === props.suscriptorId))
const nombre = ref(data.value.nombre) // otherwise data is undefined before compo unmounts 
//
const submit = async () => {
  await suscriptores.del(props.suscriptorId)
    .then(res => process.DELETE(res,
      () => grupo.get(props.grupoId).then(() => {
        model.value = false
      }),
      () => { }))
}
</script>

<template>
  <BModal v-model="model" title="Eliminar suscriptor" @hidden="back">
    <p>
      ¿Desea eliminar el suscriptor <span class="fw-semibold" v-text="nombre" />?
    </p>
    <template #footer>
      <BButton variant="primary" @click="submit">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>