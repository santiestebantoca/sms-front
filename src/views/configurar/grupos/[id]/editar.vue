<script setup>
const props = defineProps({ back: Function })

import { isValidationError } from '@/api/client'
import { useGruposStore, useGrupoStore } from '@/stores/grupos'
import { ref, computed, watch, onMounted, watchEffect } from 'vue'

const model = ref(null)
const dataReady = ref(null)
const mounted = ref(null)
const grupos = useGruposStore()
const grupo = useGrupoStore()
const data = computed(() => grupo.data)
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null
})
const errors = ref({})
watch(data, d => {
  if (d) {
    form.value.nombre = d.nombre
    form.value.apodo = d.apodo
    form.value.label = d.label
    form.value.descripcion = d.descripcion
    dataReady.value = true
  }
}, { immediate: true })
watchEffect(() => model.value = dataReady.value && mounted.value)
onMounted(() => mounted.value = true)
//
const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  await grupo.put(data.value.id, form.value)
    .then(res => {
      grupos.replace(res)
      model.value = false
    })
    .catch(err => isValidationError(err) && (errors.value = err.errors))
}
</script>

<template>
  <BModal v-model="model" title="Editar grupo" @hidden="back">
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