<script lang="ts" setup>
const props = defineProps<{
  options?: Array<{ to: any; icon: string; label: string; count?: number }>
}>()

import { useToggle } from 'bootstrap-vue-next'
import { inject } from 'vue'

const mobile = inject('app:mobile')
const { hide: hideDrawer } = useToggle('drawer-left')
</script>

<template>
  <BNav vertical class="root" :class="{ mobile }">
    <template v-if="mobile">
      <BNavItem v-for="{ to, icon, label, count } in options" :to="to" @click="hideDrawer">
        <UIcon :name="icon" class="me-2 mb-1" />
        {{ label }}
        <BBadge v-if="count > 0" variant="warning" pill class="ms-2"> {{ count }} </BBadge>
      </BNavItem>
    </template>
    <template v-else>
      <BNavItem v-for="{ to, icon, label, count } in options" :to="to" v-tippy="label">
        <UIcon :name="icon" />
        <BBadge v-if="count > 0" dot-indicator variant="warning" />
      </BNavItem>
    </template>
  </BNav>
</template>

<style scoped lang="scss">
.root {
  :deep(.nav-link.router-link-active) {
    background-color: rgba(var(--bs-primary-rgb), .15);
  }

  :deep(.nav-link:hover) {
    background-color: rgba(var(--bs-primary-rgb), .15);
  }

  &:not(.mobile) {
    :deep(.nav-link) {
      width: 36px;
      height: 36px;
      margin: 6px;
      border-radius: var(--bs-border-radius);
      position: relative;

      svg {
        width: 1.25rem;
        height: 1.25rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .badge {
        left: unset !important;
        top: unset !important;
        right: 0;
        bottom: 0;
        transform: none !important;
        padding: 5px
      }
    }
  }

}
</style>