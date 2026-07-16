<script setup>
const props = defineProps({ forward: Function, back: Function })

import { isValidationError } from '@/api/client'
import { useGrupoCreate } from '@/stores/grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const created = ref(null)
const toast = useToast()
const { mutateAsync: crearGrupo, asyncStatus } = useGrupoCreate()
const loading = computed(() => asyncStatus.value === 'loading')
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null,
})
const errors = ref({})

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearGrupo(form.value)
    .then(nuevoGrupo => {
      toast.create({ body: 'Nuevo grupo creado.', variant: 'success' })
      created.value = nuevoGrupo.id
      model.value = false
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el grupo.'
    })
}
const hidden = () => {
  if (created.value) props.forward(created.value)
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Crear grupo" @hidden="hidden">
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
        Crear
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