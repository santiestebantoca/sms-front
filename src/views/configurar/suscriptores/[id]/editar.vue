<script setup>
const props = defineProps({ suscriptorId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useSuscriptorQuery, useSuscriptoresQuery, useSuscriptorUpdate } from '@/stores/suscriptores'
import { useGruposNotificablesQuery } from '@/stores/grupos'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const tabs = ref(0)
const form = ref({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
  grupo: null,
  activo: null,
  suplente: null,
})
const errors = ref({})
const { suscriptor, isPending: suscriptorPendiente } = useSuscriptorQuery(props.suscriptorId)
const { mutateAsync: actualizarSuscriptor, asyncStatus } = useSuscriptorUpdate()
const loading = computed(() => asyncStatus.value === 'loading')
const { data: listaGrupos, grupos, isPending: gruposPendientes } = useGruposNotificablesQuery()
const grupoSeleccionado = computed(() => {
  if (listaGrupos.value) {
    const grupo = listaGrupos.value.find(d => d.id === form.value.grupo)
    if (grupo) return grupo.apodo || grupo.nombre
  }
})
const { suscriptores, isPending: suscriptoresPendiente } = useSuscriptoresQuery()

watchEffect(() => {
  if (suscriptor.value) {
    form.value.nombre = suscriptor.value.nombre
    form.value.cargo = suscriptor.value.cargo
    form.value.telefono = suscriptor.value.telefono
    form.value.correo = suscriptor.value.correo
    form.value.grupo = suscriptor.value.grupo_id
    form.value.activo = suscriptor.value.activo
    form.value.suplente = suscriptor.value.suplente_id
  }
})
onMounted(() => model.value = true)

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
  actualizarSuscriptor({ id: suscriptor.value.id, ...form.value })
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el suscriptor.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar suscriptor" @hidden="back">
    <form @submit.prevent="submit" ref="formEl">
      <BTabs v-model:index="tabs">
        <BTab>
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input class="form-control" v-model.trim="form.nombre" @input="errors.nombre = null" />
            <div class="small text-danger" v-text="errors.nombre" />
          </div>
          <div class="mb-3">
            <BFormCheckbox v-model="form.activo"> &nbsp;Activo</BFormCheckbox>
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
          <div class="mb-3">
            <label class="form-label">Grupo</label>
            <div class="form-control hstack gap-2 pe-2" style="height: 38px;" @click="tabs = 1" type="button">
              <template v-if="grupoSeleccionado">
                <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
                <span v-text="grupoSeleccionado" class="text-truncate" />
              </template>
              <UIcon name="bi-chevron-right" class="ms-auto" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Suplente</label>
            <BFormSelect v-model="form.suplente" :options="suscriptores" textField="nombre" valueField="id" />
          </div>
        </BTab>
        <BTab>
          <label class="form-label">Grupo</label>
          <div v-if="gruposPendientes" class="p-5 text-center">
            <BSpinner />
          </div>
          <RootTree v-else :childrenNames="['hijos']" v-model="form.grupo" selectable>
            <TreeNode v-for="data in grupos" :data="data" :key="data.id">
              <template #default="{ data }">
                <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
                <span v-text="data.nombre" class="text-truncate" />
              </template>
            </TreeNode>
          </RootTree>
        </BTab>
      </BTabs>
    </form>
    <template #footer>
      <BButton v-if="tabs === 0" @click="submit" variant="primary">
        Aceptar
      </BButton>
      <BButton v-else variant="primary" @click="tabs = 0">
        <UIcon name="bi-check2" />
        Listo
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