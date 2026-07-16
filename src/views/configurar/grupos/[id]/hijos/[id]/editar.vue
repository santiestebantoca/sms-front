<script setup>
const props = defineProps({ grupoId: Number, hijoId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useGrupoExpandidoQuery, useGrupoUpdate } from '@/stores/grupos'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null
})
const errors = ref({})
const { grupo: padre, isPending } = useGrupoExpandidoQuery(props.grupoId)
const grupo = computed(() => padre.value?.hijos.find(d => d.id === props.hijoId))
const { mutateAsync: actualizarGrupo, asyncStatus } = useGrupoUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (grupo.value) {
    form.value.nombre = grupo.value.nombre
    form.value.apodo = grupo.value.apodo
    form.value.label = grupo.value.label
    form.value.descripcion = grupo.value.descripcion
    form.value.pertenece = grupo.value.pertenece
  }
})
onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  actualizarGrupo({ id: grupo.value.id, ...form.value })
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el grupo.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar grupo" @hidden="back">
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
      <BButton variant="secondary" @click="model = false" :disabled="loading">
        Cancelar
      </BButton>
      <BButton @click="submit" :loading="loading" loading-fill style="width: 90px;">
        Guardar
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