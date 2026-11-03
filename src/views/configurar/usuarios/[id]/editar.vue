<script lang="ts" setup>
const props = defineProps({
  usuarioId: Number,
  back: Function
})

import { REGISTRATION_KEY_OPTIONS } from '@/constants'
import { isValidationError } from '@/api/client'
import { useAuthGroupsQuery } from '@/stores/auth-groups'
import { useUsuarioUpdate } from '@/stores/usuarios'
import type { UsuarioUpdate, UsuarioDetalle } from '@/types/models'
import { ref, computed, onMounted, inject, Ref } from 'vue'

const model = ref(false)
const usuario = inject<Ref<UsuarioDetalle>>('usuario:usuario')
const form = ref<UsuarioUpdate>({
  id: props.usuarioId,
  first_name: usuario.value.first_name,
  last_name: usuario.value.last_name,
  username: usuario.value.username,
  registration_key: usuario.value.registration_key,
  grupos: usuario.value.grupos.map((d) => d.id),
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  first_name: {
    state: errors.value.first_name ? false : null,
    invalidFeedback: errors.value.first_name,
    onInput: () => errors.value.first_name = null
  },
  last_name: {
    state: errors.value.last_name ? false : null,
    invalidFeedback: errors.value.last_name,
    onInput: () => errors.value.last_name = null
  },
  username: {
    state: errors.value.username ? false : null,
    invalidFeedback: errors.value.username,
    onInput: () => errors.value.username = null
  },
  registration_key: {
    state: errors.value.registration_key ? false : null,
    invalidFeedback: errors.value.registration_key,
    onInput: () => errors.value.registration_key = null
  },
}))
const { mutateAsync: actualizarUsuario, asyncStatus } = useUsuarioUpdate()
const loading = computed(() => asyncStatus.value === 'loading')
const { groups } = useAuthGroupsQuery()

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.first_name) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.last_name) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.username) errors.value.nombre = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  actualizarUsuario(form.value)
    .then(() => { props.back() })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el usuario.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar usuario" @hidden="back">
    <BForm id="form-usuario-editar" @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.first_name">
        <BFormInput v-model="form.first_name" trim />
      </BFormGroup>
      <BFormGroup label="Apellidos" v-bind="errorState.last_name">
        <BFormInput v-model="form.last_name" trim />
      </BFormGroup>
      <BFormGroup label="Nombre de usuario" v-bind="errorState.username">
        <BFormInput v-model="form.username" trim />
      </BFormGroup>
      <BFormGroup v-slot="{ ariaDescribedby }" label="Grupos">
        <BFormCheckboxGroup v-model="form.grupos" :aria-describedby="ariaDescribedby" class="form-control-border">
          <BFormCheckbox v-for="group in groups" :value="group.id" class="mb-3">
            <div class="text-capitalize"> {{ group.role }} </div>
            <div class="small text-secondary"> {{ group.description }} </div>
          </BFormCheckbox>
        </BFormCheckboxGroup>
      </BFormGroup>
      <BFormGroup label="Estado del registro">
        <BFormSelect v-model="form.registration_key" :options="REGISTRATION_KEY_OPTIONS" />
      </BFormGroup>
    </BForm>
    <template #footer>
      <BButton type="submit" form="form-usuario-editar" variant="primary w-90" :loading="loading" loading-fill>
        Guardar
      </BButton>
      <BButton variant="emphasis w-90" @click="back">
        Cancelar
      </BButton>
    </template>
  </BModal>
</template>