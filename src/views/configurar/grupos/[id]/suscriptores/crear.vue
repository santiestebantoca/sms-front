<script setup>
const props = defineProps({ grupoId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useGrupoStore } from '@/stores/grupos'
import { useSuscriptoresStore } from '@/stores/suscriptores'
import { ref } from 'vue'

const model = ref(true)
const grupo = useGrupoStore()
const suscriptores = useSuscriptoresStore()
const form = ref({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
  grupo: props.grupoId
})
const errors = ref({})
//
const validate = () => {
  const telefono = /^(\+53|53)?\d{8}$/
  const correo = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  if (!form.value.telefono) errors.value.telefono = 'Este campo no puede estar vacío'
  else if (!telefono.test(form.value.telefono)) errors.value.telefono = 'Formato no válido'
  if (form.value.correo && !correo.test(form.value.correo)) errors.value.correo = 'Formato no válido'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  await suscriptores.post(form.value)
    .then(() => grupo.refresh(props.grupoId, { include: 'suscriptores' }))
    .then(() => model.value = false)
    .catch(err => isValidationError(err) && (errors.value = err.errors))
}
</script>

<template>
  <BModal v-model="model" title="Nuevo suscriptor" @hidden="back">
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input class="form-control" v-model.trim="form.nombre" @input="errors.nombre = null" />
        <div class="small text-danger" v-text="errors.nombre" />
      </div>
      <div class="mb-3">
        <label class="form-label">Cargo</label>
        <input class="form-control" v-model.trim="form.cargo" />
      </div>
      <div class="mb-3">
        <label class="form-label">Teléfono</label>
        <input class="form-control" v-model.trim="form.telefono" @input="errors.telefono = null" />
        <div class="small text-danger" v-text="errors.telefono" />
      </div>
      <div class="mb-3">
        <label class="form-label">Correo</label>
        <input class="form-control" v-model.trim="form.correo" @input="errors.correo = null" />
        <div class="small text-danger" v-text="errors.correo" />
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