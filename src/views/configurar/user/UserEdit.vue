<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useUsers from '@/stores/config-users'
import { ref, computed, watch, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(null)
const users = useUsers()
const data = computed(() => users.user.data)
const form = ref({
  first_name: null,
  last_name: null,
  username: null
})
const errors = ref({})
watch(data, d => {
  if (d) {
    form.value.first_name = d.first_name
    form.value.last_name = d.last_name
    form.value.username = d.username
    model.value = true
  }
}, { immediate: true })
const validate = () => {
  errors.value = {}
  if (!form.value.first_name) errors.value.nombre = 'Este campo no puede estar vacío'
  if (!form.value.last_name) errors.value.nombre = 'Este campo no puede estar vacío'
  if (!form.value.username) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  loading.value++
  await users.user.put({ id: data.value.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => {
        Promise.all([
          users.get(),
          users.user.get(data.value.id)
        ]).then(() => model.value = false)
      },
      errs => errors.value = errs))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Editar usuario" />
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