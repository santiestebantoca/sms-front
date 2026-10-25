<script lang="ts" setup>
/**
 * Icono dinámico.
 *
 * Vía recomendada (documentación de bootstrap-vue-next + unplugin-icons): la etiqueta
 * estática auto-importada, `<IBiSearch />` o `<ILucidePlus />`, sin importar nada. Se
 * resuelve en compilación y se tree-shakea, pero NO admite nombres dinámicos: el resolver
 * de unplugin-vue-components genera los `import` durante la compilación y no registra
 * componentes globales, por lo que `<component :is="'IBiSearch'" />` falla.
 *
 * Este componente cubre solo esos casos puntuales en que el nombre viene de datos
 * (composables, `v-for`, etc.). El mapa de abajo es intencionalmente mínimo: al ser
 * imports estáticos, `<component :is>` recibe un componente y no una cadena.
 *
 * Para añadir un icono dinámico nuevo, regístralo aquí.
 */
import type { Component } from 'vue'
import { computed } from 'vue'
import ILucideMailPlus from '~icons/lucide/mail-plus'
import ILucideMails from '~icons/lucide/mails'
import ILucideUsers from '~icons/lucide/users'
import ILucideText from '~icons/lucide/text'
import ILucideUserShield from '~icons/lucide/user-shield'
import ILucideSettings from '~icons/lucide/settings'
import ILucideLogOut from '~icons/lucide/log-out'
import ILucideSquaresUnite from '~icons/lucide/squares-unite'
import ILucidePenLine from '~icons/lucide/pen-line'
import ILucideTrash from '~icons/lucide/trash'
import ILucidePlus from '~icons/lucide/plus'
import ILucideSquareCheckBig from '~icons/lucide/square-check-big'

const iconMap: Record<string, Component> = {
  'lucide-mail-plus': ILucideMailPlus,
  'lucide-mails': ILucideMails,
  'lucide-users': ILucideUsers,
  'lucide-text': ILucideText,
  'lucide-user-shield': ILucideUserShield,
  'lucide-settings': ILucideSettings,
  'lucide-log-out': ILucideLogOut,
  'lucide-squares-unite': ILucideSquaresUnite,
  'lucide-pen-line': ILucidePenLine,
  'lucide-trash': ILucideTrash,
  'lucide-plus': ILucidePlus,
  'lucide-square-check-big': ILucideSquareCheckBig,
}

const props = defineProps<{ name?: string }>()

const icon = computed(() => {
  if (!props.name) return undefined
  if (!iconMap[props.name] && import.meta.env.DEV) {
    console.warn(
      `[UIcon] Icono "${props.name}" no registrado. Usa la etiqueta estática ` +
      `(<IBiSearch />, <ILucidePlus />, ...) o agrégalo al mapa de UIcon.vue.`,
    )
  }
  return iconMap[props.name]
})
</script>

<template>
  <component :is="icon" v-if="icon" />
</template>
