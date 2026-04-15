<script setup>
const props = defineProps({ grupoId: Number, suscriptorId: Number, back: Function })

import useHandleSubmit from '@/composables/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed } from 'vue'

// const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(true)
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data.suscriptores?.find(d => d.id === props.suscriptorId))
const nombre = ref(data.value.nombre) // otherwise data is undefined before compo unmounts 
//
const submit = async () => {
  // loading.value++
  await grupos.grupo.suscriptores.del(props.suscriptorId)
    .then(res => process.DELETE(res.data,
      () => grupos.grupo.get(props.grupoId).then(() => {
        model.value = false
      }),
      () => { }))
  // loading.value--
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