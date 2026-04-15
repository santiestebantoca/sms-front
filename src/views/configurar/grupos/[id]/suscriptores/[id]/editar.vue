<script setup>
const props = defineProps({ grupoId: Number, suscriptorId: Number, back: Function })

import useHandleSubmit from '@/composables/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, watch, onMounted, watchEffect } from 'vue'

// const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(null)
const mounted = ref(null)
const dataReady = ref(null)
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data.suscriptores?.find(d => d.id === props.suscriptorId))
const form = ref({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
})
const errors = ref({})
watch(data, d => {
  if (d) {
    form.value.nombre = d.nombre
    form.value.cargo = d.cargo
    form.value.telefono = d.telefono
    form.value.correo = d.correo
    dataReady.value = true
  }
}, { immediate: true })
onMounted(() => mounted.value = true)
watchEffect(() => model.value = mounted.value && dataReady.value)
//
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
  // loading.value++
  await grupos.grupo.suscriptores.put({ id: props.suscriptorId, data: form.value })
    .then(res => process.PUT(res.data,
      () => grupos.grupo.get(props.grupoId).then(() => model.value = false),
      errs => errors.value = errs))
  // loading.value--
}
</script>

<template>
  <BModal v-model="model" title="Editar suscriptor" @hidden="back">
    <form @submit.prevent="submit">
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
    </form>
    <template #footer>
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