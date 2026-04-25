<script setup>
const props = defineProps({ data: Object })

import { useAuthStore } from '@/stores/auth/index'
import { useSmssStore, useSmsStore } from '@/stores/smss'
import { useEnviosStore } from '@/stores/envios'
import { useClipboard } from '@vueuse/core'
import { shortTime } from '@/composables/useDates'
import { ref, computed, watch, inject } from 'vue'
import ListaDestinatarios from '@/components/features/sms/ListaDestinatarios.vue'

const popover = ref(false)
const smss = useSmssStore()
const sms = useSmsStore() // no contiene datos solo funciones
//
const destinatarios = useEnviosStore()
const showDestinatarios = ref(null)
watch(showDestinatarios, val => val && destinatarios.get({ mensaje_id: props.data.id }))
//
const date = shortTime(props.data.en)
const continua = computed({
  get() {
    return props.data.continua
  },
  async set(newValue) {
    await sms.put(props.data.id, { continua: newValue })
    smss.del(props.data.id)
  }
})
const to = ref({ name: 'sms-componer', query: { previo: props.data.id } })
//
const source = ref(props.data.texto)
const { copy, copied, isSupported } = useClipboard({ source })
//
//
const ageno = computed(() => props.data.de !== useAuthStore().authUser.name)
const tippyText = ref('Menú del mensaje')
const tippy = ref({ content: tippyText.value })
const rootStyle = computed(() => ({
  '--border-badge': props.data.continua && ageno.value
    ? 'orange'
    : props.data.continua ? 'orangered' : 'var(--bs-teal)',
}))
</script>

<template>
  <div class="card shadow-sm" style="width: 20rem;" :style="rootStyle">
    <div class="card-body pt-2 gap-3">
      <BPopover placement="bottom-start" class="shadow ms-2" v-model="popover" @mouseleave="popover = false">
        <template #target>
          <div class="card-text flex-fill">
            <span style="color:var(--bs-gray-600)">
              <UIcon name="bi-chat-left" style="color:var(--bs-gray-500)" />
              <span v-text="date" class="mx-2" />
            </span>
            <span v-text="data.texto" />
          </div>
        </template>
        <!-- BPopover content -->
        <div class="text-secondary mb-3">
          <UIcon name="bi-chat-left" style="color:var(--bs-gray-500)" />
          <span v-text="date" class="mx-2" />
          <UIcon name="bi-dash" style="color:var(--bs-gray-500)" />
          <span v-text="data.de.split(' ')[0]" class="mx-1" />
        </div>
        <div v-text="data.texto" class="mb-3" />
        <BButton @click="copy(source)" variant="flat-outline-success" class="btn-sm">
          <UIcon v-if="copied" name="bi-check2" />
          <UIcon v-else name="bi-copy" />
          {{ copied ? 'Copiado' : 'Copiar texto' }}
        </BButton>
      </BPopover>
    </div>
    <div class="card-footer px-2 hstack">
      <BDropdown variant="link" no-caret v-tippy="tippy" @show="tippy.content = ''" @hide="tippy.content = tippyText">
        <template #button-content>
          <UIcon name="bi-three-dots" />
        </template>
        <template #tooltip-content>
          <span class="text-nowrap">Ver opciones</span>
        </template>
        <BDropdownItem v-if="data.continua" @click="continua = false">
          <UIcon name="bi-stop-circle" class="me-2" />
          No continuar
        </BDropdownItem>
        <BDropdownItem v-if="isSupported" @click="copy(source)">
          <UIcon name="bi-copy" class="me-2" />
          Copiar texto
        </BDropdownItem>
        <BDropdownItem @click="showDestinatarios = true">
          <UIcon name="bi-people" class="me-2" />
          Ver notificados
        </BDropdownItem>
      </BDropdown>
      <BButton v-if="data.continua" :to="to" v-tippy="'Continuar conversación'" variant="flat-outline-dark"
        class="btn-sm ms-auto">
        <UIcon name="bi-arrow-right" />
      </BButton>
    </div>
    <ListaDestinatarios v-model="showDestinatarios" :destinatarios="destinatarios.data"
      :loading="destinatarios.status.loading" />
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
  border-color: var(--border-badge);
  /* border-width: 2px; */
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
</style>
