<script setup>
const props = defineProps({ grupoId: Number, hijoId: Number, back: Function })

import { useGrupoExpandidoQuery, useGrupoDelete } from '@/stores/grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const toast = useToast()
const { grupo: padre, isPending } = useGrupoExpandidoQuery(props.grupoId)
const grupo = computed(() => padre.value?.hijos.find(d => d.id === props.hijoId))
const { mutateAsync: deleteGrupo, asyncStatus } = useGrupoDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => deleteGrupo(grupo.value)
  .then(() => model.value = false)
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="back">
    <p>
      Esta acción eliminará permanentemente:
    </p>
    <ul>
      <li>El grupo seleccionado</li>
      <li>Grupos pertenecientes a él (grupos hijos)</li>
      <li>Suscriptores pertenecientes a estos grupos</li>
    </ul>
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