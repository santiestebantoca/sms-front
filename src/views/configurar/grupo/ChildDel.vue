<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, inject } from 'vue'

const loading = inject('app:loading')
const active = inject('grupo:active')
const process = useHandleSubmit()
const model = ref(true)
const grupos = useGrupos()
const submit = async () => {
  loading.value++
  await grupos.grupo.del(props.id)
    .then(res => process.DELETE(res.data,
      () => {
        Promise.all([
          grupos.get(),
          grupos.grupo.get(grupos.grupo.data.id),
        ]).then(() => {
          active.value.children = null
          model.value = false
        })
      },
      () => { }))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Eliminar grupo" />
      <bs-dialog-body>
        <p>
          Se eliminará el grupo y se eliminarán los grupos que pertenecen a él.
          Se eliminarán también los suscriptores que pertenecen a estos grupos.
        </p>
        <p>
          ¿Desea continuar?
        </p><br>
        <bs-btn type="submit" color="primary" label="Aceptar" @click="submit" />
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>