<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, inject } from 'vue'

const loading = inject('app:loading')
const active = inject('grupo:active')
const process = useHandleSubmit()
const model = ref(true)
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data.suscriptores?.find(d => d.id === props.id))
const nombre = ref(data.value.nombre) // otherwise data is undefined before compo unmounts 
const submit = async () => {
  loading.value++
  await grupos.grupo.suscriptores.del(props.id)
    .then(res => process.DELETE(res.data,
      () => grupos.grupo.get(data.value.grupo).then(() => {
        active.value.suscriptores = null
        model.value = false
      }),
      () => { }))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Eliminar suscriptor" />
      <bs-dialog-body>
        <p>
          ¿Desea eliminar el suscriptor <span class="fw-semibold" v-text="nombre" />?
        </p><br>
        <bs-btn type="submit" color="primary" label="Aceptar" @click="submit" />
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>