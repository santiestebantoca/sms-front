<script lang="ts" setup>
const props = defineProps({
  suscriptorId: Number,
  back: Function
})

import { isValidationError } from '@/api/client'
import {
  useSuscriptoresQuery, // Para seleccionar el suplente
  useSuscriptorUpdate
} from '@/stores/suscriptores'
import type { SuscriptorUpdate } from '@/types/models'
import { ref, computed, onMounted, inject, Ref } from 'vue'

const model = ref(false)
const suscriptor = inject<Ref>('suscriptor:suscriptor')
const form = ref<SuscriptorUpdate>({
  id: props.suscriptorId,
  nombre: suscriptor.value.nombre,
  cargo: suscriptor.value.cargo,
  telefono: suscriptor.value.telefono,
  correo: suscriptor.value.correo,
  grupo: suscriptor.value.grupo_id,
  activo: suscriptor.value.activo,
  suplente: suscriptor.value.suplente_id,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre,
    onInput: () => errors.value.nombre = null
  },
  telefono: {
    state: errors.value.telefono ? false : null,
    invalidFeedback: errors.value.telefono,
    onInput: () => errors.value.telefono = null
  },
  correo: {
    state: errors.value.correo ? false : null,
    invalidFeedback: errors.value.correo,
    onInput: () => errors.value.correo = null
  },
  grupo: {
    state: errors.value.grupo ? false : null,
    invalidFeedback: errors.value.grupo,
    onInput: () => errors.value.grupo = null // No funciona, el input se genera fuera 
  },
}))
const { options: suscriptores } = useSuscriptoresQuery()
const { mutateAsync: actualizarSuscriptor, asyncStatus } = useSuscriptorUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const validate = () => {
  const telefono = /^(\+53|53)?\d{8}$/
  const correo = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.grupo) errors.value.grupo = 'Este campo no puede estar vacío.'
  if (!form.value.telefono) errors.value.telefono = 'Este campo no puede estar vacío.'
  else if (!telefono.test(form.value.telefono)) errors.value.telefono = 'Formato no válido.'
  if (form.value.correo && !correo.test(form.value.correo)) errors.value.correo = 'Formato no válido.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  actualizarSuscriptor(form.value)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el suscriptor.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar suscriptor" @hidden="back">
    <BForm id="form-suscriptor-editar" @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Cargo">
        <BFormInput v-model="form.cargo" trim />
      </BFormGroup>
      <BFormGroup label="Teléfono" v-bind="errorState.telefono">
        <BFormInput v-model="form.telefono" trim />
      </BFormGroup>
      <BFormGroup label="Correo" v-bind="errorState.correo">
        <BFormInput v-model="form.correo" trim />
      </BFormGroup>
      <SeleccionarGrupo v-model="form.grupo" #default="{ options, open }">
        <BFormGroup label="Grupo" v-bind="errorState.grupo" @click="open">
          <BFormSelect v-model="form.grupo" :options="options" no-events />
        </BFormGroup>
      </SeleccionarGrupo>
      <BFormGroup label="Activo">
        <div class="form-control-border">
          <BFormCheckbox v-model="form.activo" class="mb-0">
            {{ form.activo ? 'Sí' : 'No' }}
          </BFormCheckbox>
        </div>
      </BFormGroup>
      <BFormGroup label="Suplente">
        <BFormSelect v-model="form.suplente" :options="suscriptores" />
      </BFormGroup>
    </BForm>
    <template #footer>
      <BButton type="submit" form="form-suscriptor-editar" variant="primary w-90" :loading="loading" loading-fill>
        Guardar
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

:deep(.nav-tabs) {
  display: none;
}
</style>