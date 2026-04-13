<script setup>
const props = defineProps({ down: Boolean, closeDrawer: Function, options: Object })
</script>

<template>
  <BNav vertical class="my-1">
    <template v-if="props.down">
      <BNavItem v-for="{ to, icon, label, count } in options" :to="to" @click="closeDrawer">
        <UIcon :name="icon" class="me-2 mb-1" />
        {{ label }}
        <BBadge v-if="count" variant="warning" pill class="ms-2"> {{ count }} </BBadge>
      </BNavItem>
    </template>
    <template v-else>
      <BNavItem v-for="{ to, icon, label, count } in options" :to="to" v-tippy="label" class="up">
        <UIcon :name="icon" font-size="1.2em" />
        <BBadge v-if="count" variant="warning" pill> {{ count }} </BBadge>
      </BNavItem>
    </template>
  </BNav>
</template>

<style scoped>
.up :deep(.nav-link) {
  position: relative;
  height: 52px;
  display: flex;
  align-items: center;
}

.up :deep(.nav-link .badge) {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(-2px, -4px);
}

.up :deep(.nav-link::after) {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  bottom: var(--nav-item-underlined-nav-link-after-bottom);
  left: 2px;
  height: 100%;
  width: 2px;
  --up-after-background-color: transparent;
  background-color: var(--up-after-background-color);
  transition: all .3s;
}

.up :deep(.nav-link.router-link-active::after) {
  --up-after-background-color: var(--bs-primary) !important;
}

.up :deep(.nav-link:hover::after) {
  --up-after-background-color: var(--bs-gray-300);
}
</style>