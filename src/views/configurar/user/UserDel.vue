<script setup>
const props = defineProps({ back: Function, cancel: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useUsers from '@/stores/config-users'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const active = inject('users:id')
const process = useHandleSubmit()
const model = ref(true)
const deleted = ref(false)
const users = useUsers()
const data = computed(() => users.user.data)
const submit = async () => {
  loading.value++
  await users.user.del(data.value.id)
    .then(res => process.DELETE(res.data,
      () => users.get().then(() => {
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
      <bs-dialog-header label="Eliminar usuario" />
      <bs-dialog-body>
        <p>
          Se eliminará el usuario permanentemente pero se
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