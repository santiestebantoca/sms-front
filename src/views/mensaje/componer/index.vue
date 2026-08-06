<script setup>
import ListaPlantillas from '@/components/features/mensaje/componer/ListaPlantillas.vue'
import SeleccionarDesdeOrigenes from '@/components/features/mensaje/componer/seleccionar-desde-origenes/SeleccionarDesdeOrigenes.vue'
import { usePlantillaCreate } from '@/stores/plantillas'
import { useMensajeSend } from '@/stores/mensajes'
import { useToast } from 'bootstrap-vue-next'
import { ref, watch, computed, provide, watchEffect } from 'vue'

const formDefault = {
  destinatarios: [],
  texto: null,
  continua: true
}
const form = ref({ ...formDefault })
const errors = ref({})
const tipoSelButtons = computed(() => [
  {
    text: 'Orígenes (grupo#origen)',
    to: { name: 'sms-componer-origenes' },
    disabled: false
  },
  {
    text: 'Grupos',
    disabled: true
  },
  {
    text: 'Personas',
    disabled: true
  }
])
const origenes = ref([])
const verPlantillas = ref(false)
const { mutateAsync: enviarSms, asyncStatus: asyncStatusSms } = useMensajeSend()
const enviandoSms = computed(() => asyncStatusSms.value === 'loading')
const { mutateAsync: crearPlantilla, asyncStatus: asyncStatusPlantilla } = usePlantillaCreate()
const creandoPlantilla = computed(() => asyncStatusPlantilla.value === 'loading')
const { create: toast } = useToast()

provide('componer:origenes', origenes) // compartido con la vista /origenes

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
const resetState = () => {
  origenes.value = []
  form.value = { ...formDefault }
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
        <BButton v-tippy="'Enviar mensaje'" variant="flat-outline-primary" @click="submit" class="py-3 px-4">
          <UIcon name="bi-send" class="fs-5" />
        </BButton>
        <label class="ps-4" style="position: relative;top:2px">Para</label>
        <!-- Botones de tipo de selección (+ descartar) / Barra de resultados de selección -->
        <div class="flex-fill">
          <div class="d-flex gap-2 mb-3">
            <template v-for="btn in tipoSelButtons">
              <BButton :to="btn.to" variant="flat-outline-success" class="btn-sm" :disabled="btn.disabled">
                {{ btn.text }}
              </BButton>
            </template>
            <BButton variant="flat-outline-dark" class="btn-sm ms-auto" @click="resetState"
              v-tippy="'Descartar mensaje'">
              <UIcon name="bi-trash" class="text-danger" />
              Descartar
            </BButton>
          </div>
          <!-- Barra de selección -->
          <template v-if="origenes.length">
            <SeleccionarDesdeOrigenes v-model:origenes="origenes" v-model:destinatariosIds="form.destinatarios" />
          </template>
          <div class="btn btn-sm fs-6" v-else>Nada seleccionado aún.</div>
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