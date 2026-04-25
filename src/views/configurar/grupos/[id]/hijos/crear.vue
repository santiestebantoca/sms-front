<script setup>
const props = defineProps({ grupoId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useGruposStore, useGrupoStore } from '@/stores/grupos'
import { ref } from 'vue'

const model = ref(true)
const grupos = useGruposStore()
const grupo = useGrupoStore()
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null,
  pertenece: props.grupoId,
})
const errors = ref({})
//
const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  await grupos.post(form.value)
    .then(() => Promise.all([
      grupos.get(),
      grupo.get(props.grupoId, { include: 'hijos' })]))
    .then(() => model.value = false)
    .catch(err => isValidationError(err) && (errors.value = err.errors))
}
</script>

<template>
  <BModal v-model="model" title="Nuevo grupo" @hidden="back">
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input class="form-control" v-model.trim="form.nombre" @input="errors.nombre = null" />
        <div class="small text-danger" v-text="errors.nombre" />
      </div>
      <div class="mb-3">
        <label class="form-label">Alias</label>
        <input class="form-control" v-model.trim="form.apodo" @input="errors.apodo = null" />
        <div class="small text-danger" v-text="errors.apodo" />
      </div>
      <div class="mb-3">
        <label class="form-label">Etiquetas</label>
        <input class="form-control" v-model.trim="form.label" />
      </div>
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea class="form-control" v-model.trim="form.descripcion" />
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