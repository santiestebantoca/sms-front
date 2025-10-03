<script setup>
const props = defineProps({ data: Object })

import useAuthStore from '@/stores/auth'
import useColeccionStore from '@/stores/coleccion'
import useHandleSubmit from '@/use/useHandleSubmit.js'
import { useClipboard } from '@vueuse/core'
import { shortTime } from '@/use/useDates'
import { ref, computed, watch, inject } from 'vue'

const loading = inject('app:loading')
const coleccion = useColeccionStore()
const process = useHandleSubmit()
const date = shortTime(props.data.en)
const form = ref({
  continua: props.data.continua
})
watch(() => form.value.continua, () => submit())
const submit = async () => {
  loading.value++
  await coleccion.sms.put({ id: props.data.id, data: form.value })
    .then(res => process.PUT(res.data, () => {
      coleccion.get()
      coleccion.nav.get()
    }, () => { }))
    .catch(err => console.log(err)) // unexpected server response
  loading.value--
}
const to = ref({ name: 'sms-componer', query: { previo: props.data.id } })
//
const source = ref(props.data.texto)
const { copy, copied, isSupported } = useClipboard({ source })
//
const model = ref(null)
watch(model, () => coleccion.sms.notificados.get({ mensaje_id: props.data.id }), { once: true })
const cls = computed(() => ({
  continua: props.data.continua,
  ageno: props.data.de !== useAuthStore().authUser.id
}))
</script>

<template>
  <div class="card shadow-sm" style="width: 20rem;" :class="cls">
    <div class="card-body pt-2 gap-3">
      <div class="card-text flex-fill">
        <span style="color:var(--bs-gray-600)">
          <i class="bi-chat-left position-relative" style="top:2px;color:var(--bs-gray-500)" />
          <span v-text="date" class="mx-2" />
        </span>
        <span v-text="data.texto" />
      </div>
      <!-- popover -->
      <bs-popover customClass="shadow pre-wrap" offset="100,0" placement="bottom" :fallbackPlacements="['top']"
        trigger="hover">
        <div class="text-secondary mb-3">
          <i class="bi-chat-left position-relative" style="top:2px;color:var(--bs-gray-500)" />
          <span v-text="date" class="mx-2" />
          <i class="bi-dash position-relative" style="top:2px;color:var(--bs-gray-500)" />
          <span v-text="data.de.split(' ')[0]" class="mx-1" />
        </div>
        <div v-text="data.texto" class="mb-3" />
        <bs-btn :label="copied ? 'Copiado' : 'Copiar texto'" :icon="copied ? 'check2' : none" flat color="success"
          @click="copy(source)" outline class="btn-option " />
      </bs-popover>
    </div>
    <div class="card-footer px-2 hstack justify-content-between">
      <bs-dropdown>
        <bs-dropdown-toggle>
          <bs-btn-icon icon="three-dots" flat size="38px" />
        </bs-dropdown-toggle>
        <bs-dropdown-menu>
          <bs-dropdown-item v-if="data.continua" label="No continuar" @click="form.continua = false" />
          <bs-dropdown-item v-if="isSupported" label="Copiar texto" @click="copy(source)" />
          <bs-dropdown-item label="Ver notificados" @click="model = true" />
        </bs-dropdown-menu>
      </bs-dropdown>
      <bs-btn-icon v-if="data.continua" flat size="38px" :to="to">
        <bs-icon name="arrow-right" />
        <bs-tooltip placement="bottom" offset="0,10">Continuar</bs-tooltip>
      </bs-btn-icon>
    </div>
    <Teleport to="body">
      <bs-dialog v-model="model" scrollable>
        <bs-dialog-header label="Notificados" />
        <bs-dialog-body>
          <div v-if="coleccion.sms.notificados.status.loading" class="text-center py-4">
            <bs-spinner color="secondary" />
          </div>
          <ul v-else class="ul">
            <li v-for="d in coleccion.sms.notificados.data" class="li">
              <i class="bi-person-fill text-secondary" />
              <span v-text="d.suscriptor" />
              <span class="text-secondary" v-text="'..\\' + d.grupo" />
            </li>
          </ul>
        </bs-dialog-body>
      </bs-dialog>
    </Teleport>
  </div>
</template>

<style scoped>
:deep(.popover) {
  max-width: 400px;
  width: 400px;
  font-size: 1rem;
  border-radius: var(--bs-border-radius);
}

.card {
  --border-badge: var(--bs-teal);
  border-color: var(--border-badge);
}

.card.continua {
  --border-badge: orangered;
}

.card.continua.ageno {
  /* --border-badge: var(--bs-warning); */
  --border-badge: orange;
}

.card-body {
  min-height: 72px;
}

.card-text {
  display: -webkit-box;
  max-height: 3em;
  line-height: 1.5em;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  color: var(--bs-gray-700);
}

.card-footer {
  height: 42px;
}

.ul {
  margin: 0;
  padding: 0;
}

.ul li {
  list-style-type: none;
  /*  */
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
}

.btn-option {
  padding: 3px 8px 4px;
  font-size: .875em;
  font-weight: 600;
}
</style>
