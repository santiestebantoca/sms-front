<script setup>
const props = defineProps({ grupoId: Number, suscriptorId: Number, back: Function })

import { useGrupoStore } from '@/stores/grupos'
import { useSuscriptoresStore } from '@/stores/suscriptores'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(null)
const grupo = useGrupoStore()
const suscriptores = useSuscriptoresStore()
const nombre = ref(null) // preserva su valor aun cuando data es undefined (después de eliminado)
const toast = useToast()

watchEffect(() => {
  const data = grupo.data.suscriptores?.find(d => d.id === props.suscriptorId) || {}
  if (data.nombre) nombre.value = data.nombre
})
onMounted(() => model.value = true)

const submit = async () => {
  await suscriptores.del(props.suscriptorId)
    .then(res => {
      grupo.refresh(props.grupoId, { include: 'suscriptores' })
      model.value = false
    })
    .catch(() => toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'warning' }))
}
</script>

<template>
  <BModal v-model="model" title="Eliminar suscriptor" @hidden="back">
    <p>
      ¿Desea eliminar al suscriptor
      <span class="fw-semibold" v-text="nombre" />?
    </p>
    <p class="text-danger fw-semibold">Esta acción no se puede deshacer.</p>
    <template #footer>
      <BButton variant="secondary" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>