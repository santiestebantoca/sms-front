<script setup>
const props = defineProps({ forward: Function, back: Function })

import useHandleSubmit from '@/composables/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, onMounted } from 'vue'

const process = useHandleSubmit()
const model = ref(false)
const grupos = useGrupos()
const created = ref(null)
const toast = useToast()
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null,
})
const errors = ref({})
onMounted(() => model.value = true)
//
const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  // loading.value++
  await grupos.post(form.value)
    .then(res => process.POST(res.data,
      async id => {
        await grupos.get()
        toast.create({ body: 'Nuevo grupo creado', variant: 'success' })
        created.value = id
        model.value = false
      },
      errs => errors.value = errs))
  // loading.value--
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
      <BButton @click="submit" variant="primary">
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