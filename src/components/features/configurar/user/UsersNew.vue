<script setup>
const props = defineProps({ back: Function })

import useUsers from '@/stores/config-users'
import { ref, inject } from 'vue'

const model = ref(true)
const users = useUsers()
const form = ref({
  first_name: null,
  last_name: null,
  username: null
})
const errors = ref({})
const validate = () => {
  errors.value = {}
  if (!form.value.first_name) errors.first_name = 'Este campo no puede estar vacío'
  if (!form.value.last_name) errors.last_name = 'Este campo no puede estar vacío'
  if (!form.value.username) errors.username = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value = {}).length
}
const submit = async () => {
  if (!validate()) return
  await users.post(form.value)
    .then(res => process.POST(res,
      () => users.get().then(() => model.value = false),
      errs => errors.value = errs))
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Nuevo usuario" />
      <bs-dialog-body>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input class="form-control" v-model.trim="form.first_name" @input="errors.first_name = null" />
            <div class="small text-danger" v-text="errors.first_name" />
          </div>
          <div class="mb-3">
            <label class="form-label">Apellidos</label>
            <input class="form-control" v-model.trim="form.last_name" @input="errors.last_name = null" />
            <div class="small text-danger" v-text="errors.last_name" />
          </div>
          <div class="mb-3">
            <label class="form-label">Nombre de usuario</label>
            <input class="form-control" v-model.trim="form.username" @input="errors.username = null" />
            <div class="small text-danger" v-text="errors.username" />
          </div><br>
          <bs-btn type="submit" color="primary" label="Aceptar" />
        </form>
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>

<style scoped>
.form-label {
  color: var(--bs-teal);
  font-weight: 600;
  font-size: .875em;
}
</style>