<script setup>
const props = defineProps({ mensajePrevioId: Number, componer: Function })

import ListaDestinatarios from '@/components/features/mensaje/ListaDestinatarios.vue'
import ListaPlantillas from '@/components/features/mensaje/componer/ListaPlantillas.vue'
import { usePlantillaCreate } from '@/stores/plantillas'
import { useMensajeSend, useMensajeQuery } from '@/stores/mensajes'
import { useEnviosQuery } from '@/stores/envios'
import { useToast } from 'bootstrap-vue-next'
import { ref, watch, computed, watchEffect } from 'vue'

const formDefault = {
  destinatarios: [],
  texto: null,
  continua: false,
  previo: null
}
const form = ref({ ...formDefault })
const errors = ref({})
const selButtons = ref({
  text: '',
  click: () => verListaDestinatarios.value = true,
  variant: 'flat-primary'
})
const verPlantillas = ref(false)
const { mutateAsync: enviarSms, asyncStatus: asyncStatusSms } = useMensajeSend()
const enviandoSms = computed(() => asyncStatusSms.value === 'loading')
const { mutateAsync: crearPlantilla, asyncStatus: asyncStatusPlantilla } = usePlantillaCreate()
const creandoPlantilla = computed(() => asyncStatusPlantilla.value === 'loading')
const { create: toast } = useToast()
const { data: mensajePrevio, isLoading: cargandoMensajePrevio } = useMensajeQuery(props.mensajePrevioId)
const { destinatarios, isLoading: cargandoDestinatarios } = useEnviosQuery(props.mensajePrevioId)
const verListaDestinatarios = ref(false)

watchEffect(() => {
  if (mensajePrevio.value) {
    form.value.texto = mensajePrevio.value.texto
    form.value.previo = mensajePrevio.value.id
  }
})
watchEffect(() => {
  if (destinatarios.value)
    form.value.destinatarios = destinatarios.value.map(d => d.id)
})
watchEffect(() => {
  if (mensajePrevio.value && destinatarios.value)
    selButtons.value.text = destinatarios.value.length === 1
      ? '1 destinatario'
      : `${destinatarios.value.length} destinatarios`
})

const validate = () => {
  errors.value = {}
  if (!form.value.destinatarios.length) errors.value.destinatarios = 'La lista de destinatarios no puede estar vacía'
  if (!form.value.texto) errors.value.texto = 'El cuerpo del mensaje no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (validate()) {
    enviarSms(form.value)
      .then(() => {
        toast({ body: 'Mensaje enviado', variant: 'success', })
        resetState()
      })
      .catch(err => toast({ body: 'Mensaje no enviado', variant: 'danger', }))
  }
  else toast({
    body: Object.values(errors.value)[0],
    variant: 'warning',
  })
}
const insertarPlantilla = texto => form.value.texto = (form.value.texto ?? '') + texto
const guardarPlantilla = texto => {
  crearPlantilla({ texto })
    .then(nuevaPlantilla => {
      toast({ body: 'Nueva plantilla creada.', variant: 'success' })
    })
    .catch(err => {
      toast({ body: 'No se guardó la plantilla.', variant: 'danger' })
    })
}
</script>

<template>
  <div class="root">
    <!-- Main -->
    <div class="vstack">
      <!-- Top Bar 1 -->
      <div class="border-bottom d-flex gap-1 gap-md-3 p-2 p-md-3" style="background-color: #fefefe">
        <!-- Botón enviar -->
        <BButton v-tippy="'Enviar mensaje'" variant="flat-outline-primary" @click="submit" class="py-3 px-4"
          style="height:80px">
          <UIcon name="bi-send" class="fs-5" />
        </BButton>
        <label class="ps-4" style="position: relative;top:2px">Para</label>
        <!-- Botones de tipo de selección (+ descartar) / Barra de resultados de selección -->
        <div class="flex-fill">
          <div class="d-flex gap-2 mb-3">
            <BButton variant="flat-outline-success" class="btn-sm" disabled="disabled">
              Destinatarios de la conversación
            </BButton>
            <BButton variant="flat-outline-dark" class="btn-sm ms-auto" @click="componer" v-tippy="'Descartar mensaje'">
              <UIcon name="bi-trash" class="text-danger" />
              Descartar
            </BButton>
          </div>
          <!-- Barra de resultados de selección -->
          <div class="hstack flex-wrap overflow-hidden" style="height: 34px;">
            <UIcon name="bi-people-fill" class="flex-shrink-0 text-secondary me-2" />
            <span v-if="cargandoMensajePrevio || cargandoDestinatarios">
              ...
            </span>
            <BButton v-else :variant="selButtons.variant" class="btn-sm fs-6" @click="selButtons.click">
              <span v-text="selButtons.text" style="margin-bottom: 2px;" />
            </BButton>
          </div>
        </div>
      </div>
      <!-- Top Bar 2 -->
      <div class="border-bottom hstack px-2 px-md-3 py-1" style="background-color: #fdfdfd;">
        <BFormCheckbox v-model="form.continua"> Mensaje con continuación </BFormCheckbox>
        <!-- Plantillas -->
        <div class="mx-auto">
          <BButton variant="flat-dark" class="py-1" @click="verPlantillas = !verPlantillas" v-tippy="'Ver plantillas'">
            <UIcon name="bi-card-text" /> Plantillas
          </BButton>
          <BButton variant="flat-dark" class="py-1" :disabled="!form.texto" @click="guardarPlantilla(form.texto)"
            v-tippy="'Guardar texto en plantillas'">
            <UIcon name="bi-floppy" />
          </BButton>
        </div>
      </div>
      <textarea class="m-0 p-2 p-md-3 flex-fill overflow-auto" v-model.trim="form.texto" />
    </div>
    <ListaPlantillas v-model="verPlantillas" @select="insertarPlantilla" />
  </div>
  <ListaDestinatarios v-model="verListaDestinatarios" :mensajeId="mensajePrevioId" />
  <router-view />
</template>

<style scoped>
.root {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 30%);
  overflow: hidden;
}

/* At 1267px the second column gets 380px */
@media(min-width:1267px) {
  .root {
    grid-auto-columns: 380px;
  }
}

textarea {
  border: none;
  width: 100%;
  resize: none;
  outline: none;
}
</style>