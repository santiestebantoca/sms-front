<script lang="ts" setup>
const props = defineProps({ grupoId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useGrupoQuery, useGrupoUpdate } from '@/stores/grupos'
import type { GrupoUpdate } from '@/types/models'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const form = ref<GrupoUpdate>({
  id: props.grupoId,
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null,
  pertenece: null,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre,
    onInput: () => errors.value.nombre = null
  },
}))
const { grupo, isPending } = useGrupoQuery(props.grupoId)
const { mutateAsync: actualizarGrupo, asyncStatus } = useGrupoUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)
watchEffect(() => {
  if (grupo.value) {
    form.value.nombre = grupo.value.nombre
    form.value.apodo = grupo.value.apodo
    form.value.label = grupo.value.label
    form.value.descripcion = grupo.value.descripcion
    form.value.pertenece = grupo.value.pertenece
  }
})

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  actualizarGrupo(form.value)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el grupo.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar grupo" @hidden="back">
    <BForm id="form-hijo-editar" @submit.prevent="submit" density="3">
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
      <BButton type="submit" form="form-hijo-editar" variant="primary w-90" :loading="loading" loading-fill>
        Guardar
      </BButton>
      <BButton variant="emphasis w-90" @click="model = false">
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