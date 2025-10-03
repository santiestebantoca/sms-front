<script setup>
const props = defineProps({ back: Function, previo: Object })

import useNotificados from '@/stores/componer-notificados'
import usePlantillas from '@/stores/componer-plantillas'
import useConfigPlantillas from '@/stores/config-plantillas'
import useHandleSubmit from '@/use/useHandleSubmit.js'
import useSnackbar from '@/stores/snackbar'
import useSms from '@/stores/sms'
import usePrevio from '@/stores/componer-previo'
import { ref, watch, computed, provide, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const notificados = useNotificados()
const plantillas = usePlantillas()
const configPlantillas = useConfigPlantillas()
const snackbar = useSnackbar()
const sms = useSms()
const previoStore = usePrevio()
const formDefault = {
  destinatarios: [],
  texto: null,
  continua: true,
  previo: null
}
const form = ref({ ...formDefault })
// 
// previo:: form values
watch(() => props.previo.id, async val => {
  if (val) {
    loading.value++
    await previoStore.get(val)
    loading.value--
    if (previoStore.data.id === val) {
      form.value.destinatarios = previoStore.data.notificados.map(d => d.suscriptor_id)
      form.value.texto = previoStore.data.texto
      form.value.continua = false
      form.value.previo = previoStore.data.id
      //
      selection.value.on = true
    }
  }
}, { immediate: true })
const previosNotificadosWidget = computed(() =>
  previoStore.data.notificados.length === 1
    ? { label: '1 suscriptor' }
    : { label: `${previoStore.data.notificados.length} suscriptores` }
)
//
//
const meToo = ref(true) // I'm included in suscriber list **FUTURE**
const selection = ref({
  on: false,
  grupos: [],
})
provide('componer:selection', selection)
const to = ref({
  origen: { name: 'sms-componer-origen' },
  notificados: { name: 'sms-componer-notificados' },
  suscriptores: { name: 'sms-componer-suscriptores' },
  previos: { name: 'sms-componer-previos' }
})
watch(() => selection.value.grupos, async val => {
  if (val.length) {
    loading.value++
    await notificados.get({ grupo: val.map(d => d.id).toString() })
    selection.value.on = true
    loading.value--
  } else {
    notificados.$reset()
    selection.value.on = false
  }
})
watch(() => notificados.suscriptores.ids, val => form.value.destinatarios = val)
const delGrupo = id =>
  selection.value.grupos = selection.value.grupos.filter(d => d.id !== id)
//
const gruposNotificadosWidget = computed(() =>
  notificados.counter === 0
    ? { label: 'Ningún grupo notificado', disabled: true, cls: 'link-danger' }
    : notificados.counter === 1
      ? { label: '1 grupo notificado', disabled: false, cls: 'link-primary' }
      : { label: `${notificados.counter} grupos notificados`, disabled: false, cls: 'link-primary' }
)
const suscriptoresNotificadosWidget = computed(() =>
  notificados.suscriptores.counter === 0
    ? { label: 'Ningún suscriptor', disabled: false, cls: 'link-danger' }
    : notificados.suscriptores.counter === 1
      ? { label: '1 suscriptor', disabled: false, cls: 'link-primary' }
      : { label: `${notificados.suscriptores.counter} suscriptores`, disabled: false, cls: 'link-primary' }
)
const errors = ref({})
const validate = () => {
  errors.value = {}
  if (!form.value.destinatarios.length) errors.value.destinatarios = 'La lista de destinatarios no puede estar vacía'
  if (!form.value.texto) errors.value.texto = 'El cuerpo del mensaje no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (validate()) {
    loading.value++
    await sms.post(form.value)
      .then(res => process.POST(res.data,
        () => {
          notifyOk()
          reset()
        },
        errs => errors.value = errs))
      .catch(err => {
        notifyFails('Mensaje no enviado.')
        console.log(err)
      }) // it continues on any unexpected server response
    loading.value--
  } else notifyFails(Object.values(errors.value)[0])
}
const notifyOk = () => snackbar.add({
  text: 'Mensaje enviado.',
  color: 'success',
  icon: 'check2-circle'
})
const notifyFails = text => snackbar.add({
  text,
  color: 'danger',
  icon: 'exclamation-triangle'
})
const reset = () => {
  selection.value.grupos = []
  selection.value.on = false
  form.value = { ...formDefault }
  // previo::
  props.previo.id && props.previo.back().then(() => previoStore.$reset())

}
//
// plantillas
const plantillasWidget = ref({
  show: false,
  buscar: null,
  save: async texto => {
    loading.value++
    await configPlantillas.post({ texto })
      .then(res => process.POST(res.data,
        () => snackbar.add({
          text: 'Texto guardado en plantillas.',
          color: 'success',
          icon: 'check2-circle'
        }),
        () => { }))
    loading.value--
  }
})
const vFocus = { mounted: el => el.focus() }
watch(() => plantillasWidget.value.buscar, val => {
  if (val) plantillas.query = { texto: val }
  else plantillas.$reset()
}, { immediate: true })
watch(() => plantillasWidget.value.show, () => plantillasWidget.value.buscar = null)
</script>

<template>
  <div class="main" ref="compo">
    <!-- Main -->
    <div class="vstack">
      <div class="border-bottom d-flex gap-1 gap-md-3 p-2 p-md-3" @click="para = true">
        <bs-btn color="primary" flat class="mb-auto py-3 px-4 border-send" outline @click="submit">
          <i class="bi-send fs-5" />
          <bs-tooltip offset="0,10" placement="bottom">Enviar</bs-tooltip>
        </bs-btn>
        <label class="ps-4">Para</label>
        <div class="flex-fill">
          <div class="hstack gap-2 mb-3">
            <bs-btn :to="to.origen" label="Según origen (#origen)" color="success" flat outline class="btn-option"
              :disable="previo.id" />
            <bs-btn label="Grupos" color="success" flat outline class="btn-option" disable />
            <bs-btn label="Personas" color="success" flat outline class="btn-option" disable />
          </div>
          <template v-if="!selection.on">
            <div class="text-secondary" style="height: 34px;padding-top: 4px;">Nada seleccionado aún.</div>
          </template>
          <template v-else>
            <template v-if="selection.grupos.length">
              <!-- grupos (#origen) -->
              <div class="hstack flex-wrap overflow-hidden">
                <bs-icon name="subtract" style="color:var(--bs-yellow)" class="px-2" />
                <div v-for="d in selection.grupos" :key="d.id" class="li li-win">
                  <label v-text="d.apodo || d.nombre" style="margin-bottom: 2px;" />
                  <bs-btn icon="x" flat size="24px" class="btn-del" @click="delGrupo(d.id)" />
                </div>
                <!-- separator -->
                <bs-icon name="chevron-right" class="mx-1" style="color:var(--bs-gray-500)" />
                <!-- grupos notificados -->
                <template v-if="!notificados.loading">
                  <bs-btn square class="li li-win" :class="gruposNotificadosWidget.cls"
                    :disable="gruposNotificadosWidget.disabled" :to="to.notificados">
                    <span v-text="gruposNotificadosWidget.label" style="margin-bottom: 2px;" />
                  </bs-btn>
                </template>
                <!-- suscriptores notificados -->
                <template v-if="!notificados.loading">
                  <bs-btn square class="li li-win" :class="suscriptoresNotificadosWidget.cls"
                    :disable="suscriptoresNotificadosWidget.disabled" :to="to.suscriptores">
                    <span v-text="suscriptoresNotificadosWidget.label" style="margin-bottom: 2px;" />
                  </bs-btn>
                </template>
              </div>
            </template>
            <template v-else="previo.id">
              <!-- previos -->
              <div class="hstack flex-wrap overflow-hidden">
                <bs-icon name="people-fill" class="text-secondary px-2" />
                <!-- suscriptores previos notificados -->
                <template v-if="!previoStore.loading">
                  <bs-btn square class="li li-win link-primary" :to="to.previos">
                    <span v-text="previosNotificadosWidget.label" style="margin-bottom: 2px;" />
                  </bs-btn>
                </template>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div class="border-bottom hstack px-2 px-md-3">
        <bs-checkbox label="Mensaje con continuación" v-model="form.continua" reverse />
        <div class="mx-auto">
          <bs-btn label="Plantillas" icon="card-text" flat class="py-1"
            @click="plantillasWidget.show = !plantillasWidget.show" :active="plantillasWidget.show">
            <bs-tooltip offset="0,10" placement="bottom">Ver plantillas</bs-tooltip>
          </bs-btn>
          <bs-btn-icon flat :disable="!form.texto" :round="false" icon="floppy"
            @click="plantillasWidget.save(form.texto)" size="34px">
            <bs-tooltip offset="0,10" placement="bottom">Guardar texto en plantillas</bs-tooltip>
          </bs-btn-icon>
        </div>
      </div>
      <textarea class="m-0 p-2 p-md-3 flex-fill overflow-auto" v-model.trim="form.texto" />
    </div>
    <!-- Plantillas Widget -->
    <div v-if="plantillasWidget.show" class="plantillas-widget">
      <!-- Header -->
      <div class="sticky-top pb-1">
        <div class="hstack ps-3 pe-2" style="height: 40px;">
          <span class="small fw-semibold">PLANTILLAS</span>
          <bs-btn-icon flat size="32px" class="ms-auto" icon="x-lg" @click="plantillasWidget.show = false" />
        </div>
        <div class="ps-3 pe-3">
          <div style="flex-grow:1;max-width: 400px;" class="position-relative">
            <input v-model="plantillasWidget.buscar" class="form-control form-control-buscar"
              placeholder="Buscar en las plantillas" v-focus>
            <div v-if="plantillasWidget.buscar" class="position-absolute top-50 end-0 translate-middle-y pe-1">
              <bs-btn-icon icon="x-lg" flat size="32px" @click="plantillasWidget.buscar = null" />
            </div>
          </div>
        </div>
      </div>
      <!-- List -->
      <div class="p-3">
        <bs-btn v-for="d, i in plantillas.data" :key="i" :label="d.texto" color="secondary" flat class="btn-plt"
          @click="form.texto = form.texto ? form.texto + d.texto : d.texto" />
      </div>
    </div>
  </div>
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

.li {
  height: 34px !important;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  position: relative;
  display: flex;
}

.li-win {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

.li-win:hover {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

.li .btn-del {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .75;
  position: relative;
  left: 3px;
}

.btn-option {
  padding: 3px 8px 4px;
  font-size: .875em;
  font-weight: 600;
}

textarea {
  border: none;
  width: 100%;
  resize: none;
  outline: none;
}

.form-control-buscar {
  box-shadow: none;
}

.plantillas-widget {
  border-left: solid 1px var(--bs-gray-200);
  overflow-y: scroll;
}

.sticky-top {
  background-color: white;
  box-shadow: 0px 8px 10px 1px white;
}

.btn-plt {
  padding-top: .5rem;
  padding-bottom: .75rem;
  text-align: start;
}
</style>
