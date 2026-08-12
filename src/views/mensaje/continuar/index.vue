<script lang="ts" setup>
const props = defineProps({ mensajePrevioId: Number, componer: Function })

import ComposerTopBar from '@/components/features/mensaje/componer/ComposerTopBar.vue'
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
const form = ref<Record<string, any>>({ ...formDefault })
const errors = ref<Record<string, any>>({})
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
const submit = async () => {
  if (validate()) {
    try {
    await (enviarSms as unknown as (v: any) => Promise<any>)(form.value)
      toast({ body: 'Mensaje enviado', variant: 'success' })
      props.componer && props.componer()
    } catch (err) {
      toast({ body: 'Mensaje no enviado', variant: 'danger' })
    }
  }
  else toast({
    body: Object.values(errors.value)[0],
    variant: 'warning',
  })
}
const insertarPlantilla = (texto: string) => form.value.texto = (form.value.texto ?? '') + texto
const guardarPlantilla = async (texto: string) => {
  try {
  await (crearPlantilla as unknown as (v: any) => Promise<any>)({ texto })
    toast({ body: 'Nueva plantilla creada.', variant: 'success' })
  } catch (err) {
    toast({ body: 'No se guardó la plantilla.', variant: 'danger' })
  }
}
</script>

<template>
  <div class="root">
    <!-- Main -->
    <div class="vstack">
      <!-- Top Bar 1 + 2 -->
      <ComposerTopBar :continua="form.continua" :save-enabled="!!form.texto" @submit="submit"
        @update:continua="form.continua = $event" @toggle-plantillas="verPlantillas = !verPlantillas"
        @save-plantilla="guardarPlantilla(form.texto)">
        <template #type-buttons>
          <BButton variant="flat-outline-success" class="btn-sm" disabled="disabled">
            Destinatarios de la conversación
          </BButton>
          <BButton variant="flat-outline-dark" class="btn-sm ms-auto" @click="componer" v-tippy="'Descartar mensaje'">
            <UIcon name="bi-trash" class="text-danger" />
            Descartar
          </BButton>
        </template>
        <template #selection>
          <!-- Barra de resultados de selección -->
          <div class="hstack flex-wrap overflow-hidden resultados">
            <UIcon name="bi-people-fill" class="flex-shrink-0 text-secondary me-2" />
            <span v-if="cargandoMensajePrevio || cargandoDestinatarios">
              ...
            </span>
            <BButton v-else :variant="selButtons.variant" class="btn-sm fs-6" @click="selButtons.click">
              <span v-text="selButtons.text" />
            </BButton>
          </div>
        </template>
      </ComposerTopBar>
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

.resultados {
  height: 34px;
}

.resultados span {
  margin-bottom: 2px;
}
</style>