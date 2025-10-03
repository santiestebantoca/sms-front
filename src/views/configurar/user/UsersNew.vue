<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useUsers from '@/stores/config-users'
import { ref, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
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
  loading.value++
  await users.post(form.value)
    .then(res => process.POST(res.data,
      () => users.get().then(() => model.value = false),
      errs => errors.value = errs))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
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

.ul {
  margin: 0;
  padding: 0;
}

:deep(.li) {
  list-style-type: none;
}

:deep(.li-win) {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

:deep(.li-win:hover) {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

:deep(.li-win.active) {
  --bg-color: rgba(var(--bs-info-rgb), .2);
}

:deep(.li-win.active:hover) {
  --border-color: rgba(var(--bs-info-rgb), .3);
}

:deep(.li) {
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}

:deep(.bi-chevron) {
  font-size: .875em;
  color: var(--bs-secondary);
}

:deep(.bi-chevron:hover) {
  color: var(--bs-primary);
}

:deep(.bi-chevron::before) {
  content: "\f285";
}

:deep(.open>.bi-chevron::before) {
  content: "\f282";
}
</style>