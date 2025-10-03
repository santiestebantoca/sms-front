<!-- 
This compo uses a dialog and tabs: best UX is to scroll top on tab switch 
-->
<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useSuscriptores from '@/stores/config-suscriptores'
import useGrupos from '@/stores/config-grupos'
import GrupoSel from './GrupoSel.vue'
import { ref, computed, watch, inject, nextTick } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(true)
const tab = ref('general')
const suscriptores = useSuscriptores()
const form = ref({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
  grupo: null,
  activo: true,
  suplente: null
})
const errors = ref({})
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
  loading.value++
  await suscriptores.post(form.value)
    .then(res => process.POST(res.data,
      () => suscriptores.get().then(() => model.value = false),
      errs => errors.value = errs))
  loading.value--
}
//
const grupo = computed(() => useGrupos().find(form.value.grupo))
const suplenteOptions = computed(() => suscriptores.data.map(d => ({
  value: d.id,
  label: d.nombre,
})))
const suplente = computed(() => suscriptores.data.find(d => d.id === form.value.suplente))
//
const dialogBody = ref()
watch(tab, () => dialogBody.value.$el.scrollTop = 0)
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
      <bs-dialog-header label="Nuevo suscriptor" />
      <bs-dialog-body ref="dialogBody">
        <form @submit.prevent="submit">
          <bs-tab-content v-model="tab">
            <!-- general -->
            <bs-tab-pane name="general">
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
              <div class="mb-3">
                <label class="form-label">Grupo</label>
                <div class="form-control hstack" style="height: 38px;" @click="tab = 'grupos'" type="button">
                  <template v-if="grupo">
                    <i class="bi-subtract me-2" style="color:var(--bs-yellow)" />
                    <span v-text="grupo.nombre" />
                  </template>
                  <bs-icon name="chevron-right" class="ms-auto" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Activo</label>
                <bs-checkbox v-model="form.activo" :label="form.activo ? 'Sí' : 'No'" />
              </div>
              <div class="">
                <label class="form-label">Suplente</label>
                <div class="form-control hstack" style="height: 38px;" @click="tab = 'suplente'" type="button">
                  <span v-if="suplente" v-text="suplente.nombre" />
                  <bs-icon name="chevron-right" class="ms-auto" />
                </div>
              </div>
            </bs-tab-pane>
            <!-- grupos: like NotificaSel.vue -->
            <bs-tab-pane name="grupos">
              <label class="form-label">Grupo</label>
              <GrupoSel v-model="form.grupo" />
            </bs-tab-pane>
            <!-- suplente -->
            <bs-tab-pane name="suplente">
              <label class="form-label">Suplente</label>
              <bs-btn v-if="form.suplente" label="Ninguno -quitar el actual" color="danger" class="w-100 text-start"
                flat @click="form.suplente = null; tab = 'general'" />
              <bs-btn v-for="{ value, label, caption } in suplenteOptions" :key="value"
                @click="form.suplente = value; tab = 'general'" class="w-100 text-start" flat>
                <span v-text="label" />
                <div v-if="caption" v-text="caption" class="small text-muted" />
              </bs-btn>
            </bs-tab-pane>
          </bs-tab-content>
        </form>
      </bs-dialog-body>
      <bs-dialog-footer>
        <bs-btn v-if="tab === 'general'" @click="submit" color="primary" label="Aceptar" />
        <bs-btn v-if="tab === 'grupos'" color="primary" label="Listo" icon="check2" @click="tab = 'general'" />
        <bs-btn v-if="tab === 'suplente'" color="primary" label="Listo" icon="check2" @click="tab = 'general'" />
        <div class="ms-auto" />
      </bs-dialog-footer>
    </bs-dialog>
  </Teleport>
</template>

<style scoped>
.form-label {
  color: var(--bs-teal);
  font-weight: 600;
  font-size: .875em;
}

.ul {
  margin: 0;
  padding: 0;
}

:deep(.li) {
  list-style-type: none;
}

:deep(.li-win) {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

:deep(.li-win:hover) {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

:deep(.li-win.active) {
  --bg-color: rgba(var(--bs-info-rgb), .2);
}

:deep(.li-win.active:hover) {
  --border-color: rgba(var(--bs-info-rgb), .3);
}

:deep(.li) {
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}

:deep(.bi-chevron) {
  font-size: .875em;
  color: var(--bs-secondary);
}

:deep(.bi-chevron:hover) {
  color: var(--bs-primary);
}

:deep(.bi-chevron::before) {
  content: "\f285";
}

:deep(.open>.bi-chevron::before) {
  content: "\f282";
}
</style>