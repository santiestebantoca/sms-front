<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import usePlantillas from '@/stores/config-plantillas'
import { ref, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(true)
const plantillas = usePlantillas()
const submit = async () => {
  loading.value++
  await plantillas.plantilla.del(props.id)
    .then(res => process.DELETE(res.data,
      () => plantillas.get().then(() => model.value = false),
      () => { }))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Eliminar plantilla" />
      <bs-dialog-body>
        <p>
          Se eliminará la plantilla permanentemente.
        </p>
        <p>
          ¿Desea continuar?
        </p><br>
        <bs-btn type="submit" color="primary" label="Aceptar" @click="submit" />
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>