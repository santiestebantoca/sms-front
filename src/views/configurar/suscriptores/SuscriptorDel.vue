<script setup>
const props = defineProps({ back: Function, cancel: Function })

import useSuscriptores from '@/stores/config-suscriptores'
import { ref, computed, inject } from 'vue'

const active = inject('suscriptores:id')
const model = ref(true)
const deleted = ref(false)
const suscriptores = useSuscriptores()
const data = computed(() => suscriptores.suscriptor.data)
const submit = async () => {
  await suscriptores.suscriptor.del(data.value.id)
    .then(res => process.DELETE(res,
      () => suscriptores.get().then(() => {
        deleted.value = true
        model.value = false
      }),
      () => { }))
}
const hidden = () => {
  if (deleted.value) {
    active.value = null
    props.back()
  }
  else props.cancel()
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="hidden">
      <bs-dialog-header label="Eliminar suscriptor" />
      <bs-dialog-body>
        <p>
          Se eliminará el suscriptor permanentemente pero se
          mantendrán los registros históricos asociados a él.
        </p>
        <p>
          ¿Desea continuar?
        </p><br>
        <bs-btn type="submit" color="primary" label="Aceptar" @click="submit" />
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>