<script lang="ts" setup>
const props = defineProps({
  forward: Function,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useSuscriptoresQuery, useSuscriptorCreate } from '@/stores/suscriptores'
import { useGruposNotificablesQuery } from '@/stores/grupos'
import type { SuscriptorCreate } from '@/types/models'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed } from 'vue'

const toast = useToast()
const model = ref(false)
const form = ref<SuscriptorCreate>({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
  grupo: null,
  activo: true,
  suplente: null,
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
    onInput: () => errors.value.grupo = null
  },
}))
const { mutateAsync: crearSuscriptor, asyncStatus } = useSuscriptorCreate()
const loading = computed(() => asyncStatus.value === 'loading')
const { data: listaGrupos, grupos, isPending: gruposPendientes } = useGruposNotificablesQuery()
const nombreGrupo = computed(() => {
  if (listaGrupos.value) {
    const grupo = listaGrupos.value.find(d => d.id === form.value.grupo)
    if (grupo) return grupo.nombre
  }
})
const { suscriptores, isPending: suscriptoresPendiente } = useSuscriptoresQuery()

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
  crearSuscriptor(form.value)
    .then(nuevoSuscriptor => {
      toast.create({ body: 'Nuevo suscriptor creado.', variant: 'success' })
      props.forward(nuevoSuscriptor.id) // props.back()
    })
    .catch(err => {
      if (isValidationError(err)) errors.value = err.errors
      errors.value.form = 'Error al crear el suscriptor.'
    })
}
</script>

<template>
  <div class="max-w-500 p-3">
    <h5 class="mb-5"> Nuevo suscriptor </h5>

    <BForm @submit.prevent="submit" density="3">
      <!-- <BTabs v-model:index="tabs"> -->
      <!-- <BTab density="3"> -->
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <!-- <BFormGroup class="p-2">
        <BFormCheckbox v-model="form.activo" class="mb-0">
          Activo
        </BFormCheckbox>
      </BFormGroup> -->
      <BFormGroup label="Cargo">
        <BFormInput v-model="form.cargo" trim />
      </BFormGroup>
      <BFormGroup label="Teléfono" v-bind="errorState.telefono">
        <BFormInput v-model="form.telefono" trim />
      </BFormGroup>
      <BFormGroup label="Correo" v-bind="errorState.correo">
        <BFormInput v-model="form.correo" trim />
      </BFormGroup>
      <BFormGroup label="Grupo" v-bind="errorState.grupo" @click="model = true">
        <BFormInput v-model="nombreGrupo" trim readonly class="cursor-pointer" />
      </BFormGroup>
      <BModal v-model="model">
        seleccionar
      </BModal>
      <!-- <div class="mb-3">
            <label class="form-label">Grupo</label>
            <div class="form-control hstack gap-2 pe-2 h-38" @click="tabs = 1" type="button">
              <template v-if="grupoSeleccionado">
                <ILucideSquaresUnite class="text-yellow flex-shrink-0" />
                <span v-text="grupoSeleccionado" class="text-truncate" />
              </template>
<ILucideChevronRight class="ms-auto" />
</div>
</div>
<div class="mb-3">
  <label class="form-label">Suplente</label>
  <BFormSelect v-model="form.suplente" :options="suscriptores" textField="nombre" valueField="id" />
</div> -->
      <!-- </BTab>
      <BTab> -->
      <!-- <label class="form-label">Grupo</label>
        <div v-if="gruposPendientes" class="p-5 text-center">
          <BSpinner />
        </div>
        <RootTree v-else :childrenNames="['hijos']" v-model="form.grupo" selectable>
          <TreeNode v-for="data in grupos" :data="data" :key="data.id">
            <template #default="{ data }">
              <ILucideSquaresUnite class="text-yellow flex-shrink-0" />
              <span v-text="data.nombre" class="text-truncate" />
            </template>
          </TreeNode>
        </RootTree> -->
      <!-- </BTab>
      </BTabs> -->
    </BForm>
    <!-- <template #footer>
      <BButton v-if="tabs === 0" @click="submit" variant="primary">
        Aceptar
      </BButton>
      <BButton v-else variant="primary" @click="tabs = 0">
        <ILucideSquareCheckBig />
        Listo
      </BButton>
    </template> -->
  </div>
</template>