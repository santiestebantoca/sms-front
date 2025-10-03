<script setup>
const props = defineProps({ back: Function, cancel: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const active = inject('grupos:id')
const process = useHandleSubmit()
const model = ref(true)
const deleted = ref(false)
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data)
const submit = async () => {
  loading.value++
  await grupos.grupo.del(data.value.id)
    .then(res => process.DELETE(res.data,
      () => grupos.get().then(() => {
        deleted.value = true
        model.value = false
      }),
      () => { }))
  loading.value--
}
const backIf = () => {
  if (deleted.value) {
    active.value = null
    props.back()
  }
  else props.cancel()
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="backIf">
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