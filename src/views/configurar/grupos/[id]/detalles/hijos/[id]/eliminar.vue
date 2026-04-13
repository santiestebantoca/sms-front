<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref } from 'vue'

// const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(true)
const grupos = useGrupos()
//
const submit = async () => {
  // loading.value++
  await grupos.grupo.del(props.id)
    .then(res => process.DELETE(res.data,
      () => {
        Promise.all([
          grupos.get(),
          grupos.grupo.get(grupos.grupo.data.id),
        ]).then(() => {
          model.value = false
        })
      },
      () => { }))
  // loading.value--
}
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="back">
    <p>
      Se eliminará el grupo y se eliminarán los grupos que pertenecen a él.
      Se eliminarán también los suscriptores que pertenecen a estos grupos.
    </p>
    <p>
      ¿Desea continuar?
    </p>
    <template #footer>
      <BButton variant="primary" @click="submit">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>