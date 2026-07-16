<script setup>
const props = defineProps({ plantillaId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { usePlantillasQuery, usePlantillaUpdate } from '@/stores/plantillas'
import { ref, computed, inject, onMounted, watchEffect } from 'vue'

const model = ref(false)
const filtro = inject('plantillas:filtro')
const form = ref({
  texto: null,
})
const errors = ref({})
const { plantillas, isPending } = usePlantillasQuery()
const plantilla = computed(() => plantillas.value?.find(d => d.id === props.plantillaId))
const { mutateAsync: actualizarPlantilla, asyncStatus } = usePlantillaUpdate(filtro.value)
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (plantilla.value) {
    form.value.texto = plantilla.value.texto
  }
})
onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.texto) errors.value.texto = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  actualizarPlantilla({ id: plantilla.value.id, ...form.value })
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el grupo.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar plantilla" @hidden="back">
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Texto</label>
        <textarea rows="8" class="form-control" v-model.trim="form.texto" @input="errors.texto = null" />
        <div class="small text-danger" v-text="errors.first_name" />
      </div>
    </form>
    <template #footer>
      <BButton variant="secondary" @click="model = false" :disabled="loading">
        Cancelar
      </BButton>
      <BButton @click="submit" :loading="loading" loading-fill style="width: 90px;">
        Guardar
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