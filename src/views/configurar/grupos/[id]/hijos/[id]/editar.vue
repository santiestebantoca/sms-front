<script setup>
const props = defineProps({ grupoId: Number, hijoId: Number, back: Function })

import { useGruposStore, useGrupoStore } from '@/stores/grupos'
import { isValidationError } from '@/api/client'
import { gruposApi as api } from '@/api/grupos'
import { ref, onMounted, watchEffect } from 'vue'

const model = ref(false)
const loading = ref(true)
const grupos = useGruposStore()
const grupo = useGrupoStore()
const data = ref({})
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null
})
const errors = ref({})
//
watchEffect(() => {
  form.value.nombre = data.value.nombre
  form.value.apodo = data.value.apodo
  form.value.label = data.value.label
  form.value.descripcion = data.value.descripcion
})
onMounted(async () => {
  model.value = true
  data.value = await api.getById(props.hijoId)
  loading.value = false
})
//
const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  await api.update(props.hijoId, form.value)
    .then(res => {
      grupo.refresh(props.grupoId, { include: 'hijos' })
      grupos.replace(res)
      model.value = false
    })
    .catch(err => isValidationError(err) && (errors.value = err.errors))
}
</script>

<template>
  <BModal v-model="model" title="Editar grupo" @hidden="back">
    <div v-if="loading" class="text-center p-5">
      <BSpinner />
    </div>
    <template v-else>
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
    </template>
    <template v-if="!loading" #footer>
      <BButton variant="primary" @click="submit">
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