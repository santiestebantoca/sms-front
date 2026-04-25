<script setup>
const props = defineProps({ back: Function, previo: Object })

import ListaDestinatarios from '@/components/features/sms/ListaDestinatarios.vue'
import ListaPlantillas from '@/components/features/sms/componer/ListaPlantillas.vue'
import { usePlantillasStore } from '@/stores/plantillas'
import { useSmsStore } from '@/stores/smss'
import { useGruposNotificadosStore, useNotificadosCheckedStore } from '@/stores/grupos-notificados'
// import { useEnviosStore } from '@/stores/envios' // Para ListaDestinatarios
import { useToast } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { ref, watch, computed, provide, watchEffect } from 'vue'

const { create: toast } = useToast()
const plantillas = usePlantillasStore()
const notificados = useGruposNotificadosStore()
const { gruposIds, destinatariosIds } = storeToRefs(useNotificadosCheckedStore())
const sms = useSmsStore()
const verPlantillas = ref(false)
const errors = ref({})
const formDefault = {
  destinatarios: [],
  texto: null,
  continua: true,
  previo: null
}
const form = ref({ ...formDefault })
const origen = ref([])
provide('componer:origen', origen) // compartido con la vista /origen
//
// Para presentar la interfaz a partir un mensaje previo
const verListaDestinatarios = ref(false)
const destinatariosPrevios = ref([])
const destinatariosPreviosLoading = ref(false)
watch(() => props.previo.id, async (val, oldVal) => {
  if (val) {
    destinatariosPreviosLoading.value = true
    const smsPrevio = await sms.get(val, { include: "destinatarios" })
    destinatariosPreviosLoading.value = false
    if (smsPrevio.id === val) {
      destinatariosPrevios.value = smsPrevio.destinatarios
      form.value.destinatarios = smsPrevio.destinatarios.map(d => d.suscriptor_id)
      form.value.texto = smsPrevio.texto
      form.value.continua = false
      form.value.previo = val
    }
  }
  else if (oldVal) resetState()
}, { immediate: true })
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
// Botones de la selección (grupos o destinatarios previos)
const selButtons = computed(() => ({
  origen: origen.value.map(grupo => ({
    text: grupo.apodo || grupo.nombre,
    click: () => quitarGrupo(grupo.id),
    variant: 'flat-dark',
    tippy: `${grupo.nombre} (Click para quitar)`
  })),
  ...props.previo.id
    ? {
      previos: {
        text: destinatariosPrevios.value.length === 1
          ? '1 destinatario'
          : `${destinatariosPrevios.value.length} destinatarios`,
        click: () => verListaDestinatarios.value = true,
        variant: 'flat-primary'
      }
    }
    : {},
  grupos: {
    text: gruposIds.value.length === 0
      ? 'Ningún grupo notificado'
      : gruposIds.value.length === 1
        ? '1 grupo notificado'
        : `${gruposIds.value.length} grupos notificados`,
    to: { name: 'sms-componer-notificados' },
    variant: gruposIds.value.length === 0 ? 'flat-danger' : 'flat-primary'
  },
  suscriptores: {
    text: destinatariosIds.value.length === 0
      ? 'Ningún destinatario'
      : destinatariosIds.value.length === 1
        ? '1 destinatario'
        : `${destinatariosIds.value.length} destinatarios`,
    to: { name: 'sms-componer-suscriptores' },
    variant: destinatariosIds.value.length === 0 ? 'flat-danger' : 'flat-primary'
  }
}))
//
watchEffect(() => form.value.destinatarios = destinatariosIds.value)
watch(origen, async val => {
  if (val.length) {
    await notificados.get({ origen: val.map(d => d.id).toString(), include: 'suscriptor' })
  } else {
    notificados.reset()
  }
})
//
const validate = () => {
  errors.value = {}
  if (!form.value.destinatarios.length) errors.value.destinatarios = 'La lista de destinatarios no puede estar vacía'
  if (!form.value.texto) errors.value.texto = 'El cuerpo del mensaje no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (validate()) {
    await sms.post(form.value)
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
const guardarPlantilla = async texto => {
  await plantillas.post({ texto })
    .then(() => toast({
      body: 'Texto guardado en plantillas.',
      variant: 'success',
    }))
    .catch(err => toast({
      body: 'No se pudo guardar la plantilla.',
      variant: 'danger',
    }))
}
const resetState = () => {
  origen.value = []
  form.value = { ...formDefault }
  if (props.previo.id) props.previo.back()
}
const insertarPlantilla = val => form.value.texto = (form.value.texto ?? '') + val
const quitarGrupo = id => origen.value = origen.value.filter(d => d.id !== id)
</script>

<template>
  <div class="main" ref="compo">
    <!-- Main -->
    <div class="vstack">
      <!-- Top Bar 1 -->
      <div class="border-bottom d-flex gap-1 gap-md-3 p-2 p-md-3" style="background-color: #fefefe"
        @click="para = true">
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
              Descartar
            </BButton>
          </div>
          <!-- Barra de resultados de selección -->
          <template v-if="origen.length">
            <div class="hstack flex-wrap overflow-hidden">
              <UIcon name="bi-subtract" style="color:var(--bs-yellow)" class="flex-shrink-0 me-2" />
              <BButton v-for="origen, index in selButtons.origen" :key="index" :variant="origen.variant"
                class="btn-sm fs-6" @click="origen.click" v-tippy="origen.tippy">
                {{ origen.text }}
              </BButton>
              <!-- separator -->
              <UIcon name="bi-chevron-right" class="flex-shrink-0 mx-1" font-size="12" />
              <!-- grupos notificados -->
              <template v-if="!notificados.status.loading">
                <BButton class="btn-sm fs-6" :variant="selButtons.grupos.variant" :to="selButtons.grupos.to">
                  <span v-text="selButtons.grupos.text" style="margin-bottom: 2px;" />
                </BButton>
              </template>
              <!-- destinitarios -->
              <template v-if="!notificados.status.loading">
                <BButton class="btn-sm fs-6" :variant="selButtons.suscriptores.variant"
                  :to="selButtons.suscriptores.to">
                  <span v-text="selButtons.suscriptores.text" style="margin-bottom: 2px;" />
                </BButton>
              </template>
            </div>
          </template>
          <template v-else-if="previo.id">
            <div class="hstack flex-wrap overflow-hidden">
              <UIcon name="bi-people-fill" class="flex-shrink-0 text-secondary me-2" />
              <!-- destinatarios previos -->
              <template v-if="!destinatariosPreviosLoading">
                <BButton :variant="selButtons.previos.variant" class="btn-sm fs-6" @click="selButtons.previos.click">
                  <span v-text="selButtons.previos.text" style="margin-bottom: 2px;" />
                </BButton>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="text-secondary" style="height: 34px;padding-top: 4px;">Nada seleccionado aún.</div>
          </template>
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
  <template v-if="previo.id">
    <ListaDestinatarios v-model="verListaDestinatarios" :destinatarios="destinatariosPrevios"
      :loading="destinatariosPreviosLoading" />
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