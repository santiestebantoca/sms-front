<script setup>
const props = defineProps({ grupoId: Number, suscriptorId: Number, back: Function })

import { useGrupoExpandidoQuery } from '@/stores/grupos'
import { useSuscriptorDelete } from '@/stores/suscriptores'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const toast = useToast()
const { grupo, isPending } = useGrupoExpandidoQuery(props.grupoId)
const suscriptor = computed(() => grupo.value?.suscriptores.find(item => item.id === props.suscriptorId))
const { mutateAsync: eliminarSuscriptor, asyncStatus } = useSuscriptorDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarSuscriptor(suscriptor.value)
  .then(() => model.value = false)
  .catch((err) => {
    console.log(err)
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
</script>

<template>
  <BModal v-model="model" title="Eliminar suscriptor" @hidden="back">
    <p>
      Esta acción eliminará permanentemente al suscriptor seleccionado.
    </p>
    <p class="text-danger fw-semibold">Esta acción no se puede deshacer.</p>
    <template #footer>
      <BButton variant="secondary" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :disabled="isPending">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>