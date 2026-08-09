<script setup>
const props = defineProps({ data: Object })

import { useAuthQuery } from '@/stores/auth/index'
import { useMensajeUpdate } from '@/stores/mensajes'
import { useClipboard } from '@vueuse/core'
import { shortTime } from '@/composables/useDates.ts'
import { ref, computed, watch } from 'vue'
import ListaDestinatarios from '@/components/features/mensaje/ListaDestinatarios.vue'

const popover = ref(false)
const showDestinatarios = ref(null)
const date = shortTime(props.data.en)
const source = ref(props.data.texto)
const to = ref({ name: 'sms-continuar', params: { mensajePrevioId: props.data.id } })
const { mutateAsync: actualizarMensaje, asyncStatus } = useMensajeUpdate()
const { copy, copied, isSupported } = useClipboard({ source })
const { authUser } = useAuthQuery()
const ageno = computed(() => props.data.de !== authUser.value.name)
const tippyText = ref('Menú del mensaje')
const tippy = ref({ content: tippyText.value })
const rootStyle = computed(() => ({
  '--bs-card-border-color': props.data.continua && ageno.value
    ? 'orange'
    : props.data.continua ? 'orangered' : 'var(--bs-teal)',
}))

const noContinuar = () => actualizarMensaje({ id: props.data.id, continua: false })
</script>

<template>
  <BCard class="shadow-sm" style="width: 20rem;" :style="rootStyle">
    <BCardText>
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
    </BCardText>
    <template #footer>
      <BDropdown variant="link" no-caret v-tippy="tippy" @show="tippy.content = ''" @hide="tippy.content = tippyText">
        <template #button-content>
          <UIcon name="bi-three-dots" />
        </template>
        <template #tooltip-content>
          <span class="text-nowrap">Ver opciones</span>
        </template>
        <BDropdownItem v-if="data.continua" @click="noContinuar">
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
    </template>
  </BCard>
  <ListaDestinatarios v-model="showDestinatarios" :mensajeId="data.id" />
</template>

<style scoped>
:deep(.popover) {
  max-width: 400px;
  width: 400px;
  font-size: 1rem;
  border-radius: var(--bs-border-radius);
}

:deep(.card) {
  border-color: var(--border-badge);
}

:deep(.card-body) {
  min-height: 80px;
}

:deep(.card-text) {
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

:deep(.card-footer) {
  /* height: 42px; */
  display: flex;
  align-items: center;
  --bs-card-cap-padding-y: 4px;
  --bs-card-cap-padding-x: 8px;
}
</style>
