<script setup>
const props = defineProps({ usuarioId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useUsuarioQuery, useUsuarioUpdate } from '@/stores/usuarios'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const form = ref({
  first_name: null,
  last_name: null,
  username: null,
  registration_key: null,
})
const errors = ref({})
const { usuario, isPending: usuarioPendiente } = useUsuarioQuery(props.usuarioId)
const { mutateAsync: actualizarUsuario, asyncStatus } = useUsuarioUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (usuario.value) {
    form.value.first_name = usuario.value.first_name
    form.value.last_name = usuario.value.last_name
    form.value.username = usuario.value.username
    form.value.registration_key = usuario.value.registration_key
  }
})
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
  actualizarUsuario({ id: usuario.value.id, ...form.value })
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el usuario.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar usuario" @hidden="back">
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
      <div class="mb-3">
        <label class="form-label">Clave de registro</label>
        <input class="form-control" v-model.trim="form.registration_key" @input="errors.registration_key = null" />
        <div class="small text-danger" v-text="errors.registration_key" />
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
</style>