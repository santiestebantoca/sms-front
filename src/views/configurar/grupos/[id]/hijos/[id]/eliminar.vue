<script lang="ts" setup>
const props = defineProps({ grupoId: Number, back: Function })

import { useGrupoDelete } from '@/stores/grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const toast = useToast()
const { mutateAsync: eliminarGrupo, asyncStatus } = useGrupoDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarGrupo(props.grupoId)
  .then(() => model.value = false)
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' }).show()
  })
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="back">
    <p>
      Se eliminarán permanentemente:
    </p>
    <ul>
      <li>El grupo seleccionado,</li>
      <li>los grupos pertenecientes a él (grupos hijos) y</li>
      <li>los suscriptores pertenecientes a estos grupos.</li>
    </ul>
    <p class="text-danger fw-semibold">
      Esta acción no se puede deshacer.
    </p>
    <template #footer>
      <BButton variant="emphasis" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger w-90" @click="submit" :loading="loading" loading-fill>
        Eliminar
      </BButton>
    </template>
  </BModal>
</template>