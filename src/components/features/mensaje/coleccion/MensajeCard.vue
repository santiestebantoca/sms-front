<script lang="ts" setup>
const props = defineProps({ data: Object })

import { useAuthQuery } from '@/stores/auth/index'
import { useMensajeUpdate } from '@/stores/mensajes'
import { useClipboard } from '@vueuse/core'
import { shortTime } from '@/composables/useDates'
import { ref, computed } from 'vue'
import ListaDestinatarios from '@/components/features/mensaje/ListaDestinatarios.vue'

const popover = ref(false)
const showDestinatarios = ref(null)
const date = shortTime(props.data.en)
const source = ref(props.data.texto)
const to = ref({ name: 'sms-continuar', params: { mensajePrevioId: props.data.id } })
const { mutateAsync: actualizarMensaje } = useMensajeUpdate()
const { copy, copied, isSupported } = useClipboard({ source })
const { authUser } = useAuthQuery()
const ageno = computed(() => props.data.de !== authUser.value.name)
const rootStyle = computed(() => ({
  '--bs-card-border-color': props.data.continua && ageno.value
    ? 'orange'
    : props.data.continua ? 'orangered' : 'var(--bs-teal)',
}))

const noContinuar = () => actualizarMensaje({ id: props.data.id, continua: false })
</script>

<template>
  <BCard class="shadow-sm w-20rem" :style="rootStyle">
    <BCardText>
      <BPopover placement="bottom-start" class="shadow ms-2" v-model="popover" @mouseleave="popover = false">
        <template #target>
          <div class="card-text flex-fill">
            <span class="text-gray-600">
              <ILucideMessageSquare class="text-gray-500" />
              <span v-text="date" class="mx-2" />
            </span>
            <span v-text="data.texto" />
          </div>
        </template>
        <!-- BPopover content -->
        <div class="text-secondary mb-3">
          <ILucideMessageSquare class="text-gray-500" />
          <span v-text="date" class="mx-2" />
          <ILucideMinus class="text-gray-500" />
          <span v-text="data.de.split(' ')[0]" class="mx-1" />
        </div>
        <div v-text="data.texto" class="mb-3" />
        <BButton @click="copy(source)" variant="flat-success border" class="btn-sm">
          <ILucideSquareCheckBig v-if="copied" />
          <ILucideCopy v-else />
          {{ copied ? 'Copiado' : 'Copiar texto' }}
        </BButton>
      </BPopover>
    </BCardText>
    <template #footer>
      <BDropdown variant="flat wh-36" no-caret v-tippy="'Menú del mensaje'">
        <template #button-content>
          <ILucideEllipsis class="center" />
        </template>
        <template #tooltip-content>
          <span class="text-nowrap">Ver opciones</span>
        </template>
        <BDropdownItem v-if="data.continua" @click="noContinuar">
          <ILucideCircleStop class="me-2" />
          No continuar
        </BDropdownItem>
        <BDropdownItem v-if="isSupported" @click="copy(source)">
          <ILucideCopy class="me-2" />
          Copiar texto
        </BDropdownItem>
        <BDropdownItem @click="showDestinatarios = true">
          <ILucideUsers class="me-2" />
          Ver notificados
        </BDropdownItem>
      </BDropdown>
      <BButton v-if="data.continua" :to="to" v-tippy="'Continuar conversación'" variant="flat wh-36 ms-auto">
        <ILucideArrowRight class="center" />
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
  display: flex;
  align-items: center;
  --bs-card-cap-padding-y: 4px;
  --bs-card-cap-padding-x: 8px;
}
</style>
