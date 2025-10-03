<script setup>
import Header from '@/views/app/AppHeader.vue'
import useNavOptions from './base/nav'

const nav = useNavOptions().options
</script>

<template>
  <app-layout>
    <app-header class="bg-white">
      <Header />
    </app-header>
    <app-footer>
      <div id="app-footer-content" />
    </app-footer>
    <app-page-container>
      <app-page class="grid px-3">
        <div class="ngrid">
          <div class="logo">SMS</div>
          <div class="links">
            <div>
              <h5 class="text-muted mb-3">Mensaje</h5>
              <router-link v-for="{ label, to, icon } in nav.componer" :to="to"
                class="text-decoration-none d-block py-2">
                <bs-icon :name="icon" class="me-2 mb-1" />
                <span v-text="label" />
              </router-link>
            </div>
            <div>
              <h5 class="text-muted mb-3">Configurar</h5>
              <router-link v-for="{ label, to, icon } in nav.configurar" :to="to"
                class="text-decoration-none d-block py-2">
                <bs-icon :name="icon" class="me-2 mb-1" />
                <span v-text="label" />
              </router-link>
            </div>
          </div>
        </div>
      </app-page>
    </app-page-container>
  </app-layout>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: auto;
  /* grid-template-rows: 1fr auto; */
  justify-content: center;
  align-items: center;
}

.ngrid {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 3em;
  max-width: 760px;
  /* height: 100%; */
  max-height: 400px;
  /*  */
  /* width: 320px; */
}

.logo {
  font-size: 116px;
  font-weight: bold;
  text-align: center;
  color: var(--bs-gray-300);
}

.links {
  display: flex;
  gap: 100px;
  justify-content: space-between;
}

@media (max-width: 351.98px) {
  .ngrid {
    /*  */
    width: calc(100vw - 32px);
  }
}
</style>

<!-- <style scoped>
.welcome {
  height: 26px;
  display: flex;
  align-items: center;
  background-color: #dadcde;
  color: rgb(100, 110, 120);
  padding-left: 12px;
}

.grid {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
  max-width: 720px;
  margin: 0 auto;
}

.grid h4 {
  grid-column: 1/-1;
}

/* BS sm */
@media (min-width: 576px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style> -->
