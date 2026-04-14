<script setup>
const props = defineProps({ back: Function, previo: Object })

import ListaNotificados from '@/components/features/sms/ListaNotificados.vue'
import ListaPlantillas from '@/components/features/sms/componer/ListaPlantillas.vue'
import useConfigPlantillas from '@/stores/config-plantillas'
import useNotificados from '@/stores/componer-notificados'
import useHandleSubmit from '@/composables/useHandleSubmit.js'
import useSms from '@/stores/sms'
import usePrevio from '@/stores/componer-previo'
import { useToast } from 'bootstrap-vue-next'
import { ref, watch, computed, provide } from 'vue'

const { create: toast } = useToast()
// const loading = inject('app:loading')
const process = useHandleSubmit()
const configPlantillas = useConfigPlantillas()
const notificados = useNotificados()
const sms = useSms()
const previoStore = usePrevio()
const verPlantillas = ref(false)
const verNotificados = ref(false)
const errors = ref({})
const formDefault = {
  destinatarios: [],
  texto: null,
  continua: true,
  previo: null
}
const form = ref({ ...formDefault })
// 
// previo:: form values
watch(() => props.previo.id, async (val, oldVal) => {
  if (val) {
    // ?oading.value++
    await previoStore.get(val)
    // loading.value--
    if (previoStore.data.id === val) {
      form.value.destinatarios = previoStore.data.notificados.map(d => d.suscriptor_id)
      form.value.texto = previoStore.data.texto
      form.value.continua = false
      form.value.previo = previoStore.data.id
      //
      selection.value.on = true
    }
  }
  else if (oldVal) {
    resetState()
  }
}, { immediate: true })
//
const meToo = ref(true) // I'm included in suscriber list **FUTURE**
const selection = ref({
  on: false,
  grupos: [],
})
provide('componer:selection', selection)
//
// Botones de tipo de selección de destinatarios
const tipoSelButtons = computed(() => [
  {
    text: 'Según origen (#origen)',
    to: { name: 'sms-componer-origen' },
    disabled: !!props.previo.id
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
//
// Botones de selección de destinatarios activa
const selButtons = computed(() => ({
  origen: selection.value.grupos.map(grupo => ({
    text: grupo.apodo || grupo.nombre,
    click: () => quitarGrupo(grupo.id),
    variant: 'flat-warning',
    tippy: `${grupo.nombre} (Click para quitar)`
  })),
  previos: {
    text: previoStore.counter === 1
      ? '1 suscriptor'
      : `${previoStore.counter} suscriptores`,
    click: () => verNotificados.value = true,
    variant: 'flat-primary'
  },
  grupos: {
    text: notificados.counter === 0
      ? 'Ningún grupo notificado'
      : notificados.counter === 1
        ? '1 grupo notificado'
        : `${notificados.counter} grupos notificados`,
    to: { name: 'sms-componer-notificados' },
    variant: notificados.counter === 0 ? 'flat-danger' : 'flat-primary'
  },
  suscriptores: {
    text: notificados.suscriptores.counter === 0
      ? 'Ningún suscriptor'
      : notificados.suscriptores.counter === 1
        ? '1 suscriptor'
        : `${notificados.suscriptores.counter} suscriptores`,
    to: { name: 'sms-componer-suscriptores' },
    variant: notificados.suscriptores.counter === 0 ? 'flat-danger' : 'flat-primary'
  }
}))
//
watch(() => selection.value.grupos, async val => {
  if (val.length) {
    // loading.value++
    await notificados.get({ grupo: val.map(d => d.id).toString() })
    selection.value.on = true
    // loading.value--
  } else {
    notificados.$reset()
    selection.value.on = false
  }
})
watch(() => notificados.suscriptores.ids, val => form.value.destinatarios = val)
//
//
const validate = () => {
  errors.value = {}
  if (!form.value.destinatarios.length) errors.value.destinatarios = 'La lista de destinatarios no puede estar vacía'
  if (!form.value.texto) errors.value.texto = 'El cuerpo del mensaje no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (validate()) {
    // loading.value++
    await sms.post(form.value)
      .then(res => process.POST(res.data,
        () => {
          notifyOk()
          resetState()
        },
        errs => errors.value = errs))
      .catch(err => {
        notifyFails('Mensaje no enviado.')
        console.log(err)
      }) // it continues on any unexpected server response
    // loading.value--
  } else notifyFails(Object.values(errors.value)[0])
}
const guardarPlantilla = async texto => {
  // loading.value++
  await configPlantillas.post({ texto })
    .then(res => process.POST(res.data,
      () => toast({
        body: 'Texto guardado en plantillas.',
        variant: 'success',
      }),
      () => { }))
  // loading.value--
}
const notifyOk = () => toast({
  body: 'Mensaje enviado.',
  variant: 'success',
})
const notifyFails = text => toast({
  body: text,
  variant: 'danger',
})
const resetState = () => {
  selection.value.grupos = []
  selection.value.on = false
  form.value = { ...formDefault }
  if (props.previo.id) props.previo.back().then(() => previoStore.$reset())
  else previoStore.$reset()
}
const insertarPlantilla = val => form.value.texto = (form.value.texto ?? '') + val
const quitarGrupo = id =>
  selection.value.grupos = selection.value.grupos.filter(d => d.id !== id)
</script>

<template>
  <div class="main" ref="compo">
    <!-- Main -->
    <div class="vstack">
      <div class="border-bottom d-flex gap-1 gap-md-3 p-2 p-md-3" style="background-color: #fefefe"
        @click="para = true">
        <BButton v-tippy="'Enviar mensaje'" variant="flat-outline-primary" @click="submit" class="py-3 px-4">
          <UIcon name="bi-send" class="fs-5" />
        </BButton>
        <label class="ps-4" style="position: relative;top:2px">Para</label>
        <div class="flex-fill">
          <div class="d-flex gap-2 mb-3">
            <template v-for="btn in tipoSelButtons">
              <BButton :to="btn.to" variant="flat-outline-success" class="btn-sm" :disabled="btn.disabled">
                {{ btn.text }}
              </BButton>
            </template>
            <BButton variant="flat-outline-dark" class="btn-sm ms-auto" @click="resetState"
              v-tippy="'Descartar mensaje'">
              Descartar
            </BButton>
          </div>
          <!-- Display selection / every button like btn-sm with 1em (it makes 34px height)-->
          <template v-if="!selection.on">
            <div class="text-secondary" style="height: 34px;padding-top: 4px;">Nada seleccionado aún.</div>
          </template>
          <template v-else>
            <template v-if="selection.grupos.length">
              <!-- grupos (#origen) -->
              <div class="hstack flex-wrap overflow-hidden">
                <UIcon name="bi-subtract" style="color:var(--bs-yellow)" class="flex-shrink-0 me-2" />
                <BButton v-for="origen, index in selButtons.origen" :key="index" :variant="origen.variant"
                  class="btn-sm fs-6" @click="origen.click" v-tippy="origen.tippy">
                  {{ origen.text }}
                </BButton>
                <!-- separator -->
                <UIcon name="bi-chevron-right" class="mx-1" font-size="12" />
                <!-- grupos notificados -->
                <template v-if="!notificados.loading">
                  <BButton class="btn-sm fs-6" :variant="selButtons.grupos.variant" :to="selButtons.grupos.to">
                    <span v-text="selButtons.grupos.text" style="margin-bottom: 2px;" />
                  </BButton>
                </template>
                <!-- suscriptores notificados -->
                <template v-if="!notificados.loading">
                  <BButton class="btn-sm fs-6" :variant="selButtons.suscriptores.variant"
                    :to="selButtons.suscriptores.to">
                    <span v-text="selButtons.suscriptores.text" style="margin-bottom: 2px;" />
                  </BButton>
                </template>
              </div>
            </template>
            <template v-else="previo.id">
              <!-- previos -->
              <div class="hstack flex-wrap overflow-hidden">
                <UIcon name="bi-people-fill" class="flex-shrink-0 text-secondary me-2" />
                <!-- suscriptores previos notificados -->
                <template v-if="!previoStore.loading">
                  <BButton :variant="selButtons.previos.variant" class="btn-sm fs-6" @click="selButtons.previos.click">
                    <span v-text="selButtons.previos.text" style="margin-bottom: 2px;" />
                  </BButton>
                </template>
              </div>
            </template>
          </template>
        </div>
      </div>
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
  <template v-if="previo.id">
    <ListaNotificados v-model="verNotificados" :notificados="previoStore.data.notificados"
      :loading="previoStore.status.loading" />
  </template>
  <router-view />
</template>

<style scoped>
.main {
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
  .main {
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