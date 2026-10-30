<script lang="ts" setup>
const props = defineProps({ padreId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useGrupoCreate } from '@/stores/grupos'
import type { GrupoCreate } from '@/types/models'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const form = ref<GrupoCreate>({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null,
  pertenece: props.padreId,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre,
    onInput: () => errors.value.nombre = null
  },
}))
const { mutateAsync: crearGrupo, asyncStatus } = useGrupoCreate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearGrupo(form.value)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el grupo.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Nuevo grupo" @hidden="back">
    <BForm id="form-hijo-crear" @submit.prevent="submit">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Alias">
        <BFormInput v-model="form.apodo" trim />
      </BFormGroup>
      <BFormGroup label="Etiquetas">
        <BFormInput v-model="form.label" trim />
      </BFormGroup>
      <BFormGroup label="Descripción">
        <BFormTextarea v-model="form.descripcion" no-resize />
      </BFormGroup>
    </BForm>
    <template #footer>
      <BButton type="submit" form="form-hijo-crear" variant="primary w-90" :loading="loading" loading-fill>
        Crear
      </BButton>
      <BButton variant="emphasis w-90" @click="back">
        Cancelar
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