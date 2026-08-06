<script setup>
const props = defineProps({ forward: Function, back: Function })

import { isValidationError } from '@/api/client'
import { useUsuarioCreate } from '@/stores/usuarios'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const created = ref(null)
const toast = useToast()
const form = ref({
  first_name: null,
  last_name: null,
  username: null
})
const errors = ref({})
const { mutateAsync: crearUsuario, asyncStatus } = useUsuarioCreate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.first_name) errors.value.nombre = 'Este campo no puede estar vacío'
  if (!form.value.last_name) errors.value.nombre = 'Este campo no puede estar vacío'
  if (!form.value.username) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  crearUsuario(form.value)
    .then(nuevoUsuario => {
      toast.create({ body: 'Nuevo grupo creado.', variant: 'success' })
      created.value = nuevoUsuario.id
      model.value = false
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el usuario.'
    })
}
const hidden = () => {
  if (created.value) props.forward(created.value)
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Crear usuario" @hidden="hidden">
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
      </div>
    </form>
    <template #footer>
      <BButton @click="submit" variant="primary">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>

<style scoped>
.form-label {
  color: var(--bs-teal);
  font-weight: 600;
  font-size: .875em;
}

:deep(.nav-tabs) {
  display: none;
}
</style>