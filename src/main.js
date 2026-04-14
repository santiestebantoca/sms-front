import '@/assets/css/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { plugin as VueTippy } from 'vue-tippy' // Nota: importación nombrada 'plugin'
import 'tippy.js/dist/tippy.css'      // Estilos base
import 'tippy.js/themes/light.css'    // Tema claro (opcional)
import App from './App.vue'
import { router } from './router'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(VueTippy, {
    directive: 'tippy',           // Nombre de la directiva (por defecto: 'tippy')
    component: 'tippy',           // Nombre del componente (por defecto: 'tippy')
    componentSingleton: 'tippy-singleton', // Para tooltips singleton (avanzado)
    defaultProps: {               // Props por defecto para todos los tooltips
        placement: 'bottom',         // Posición por defecto
        allowHTML: false,         // Por seguridad, no permitir HTML por defecto
        animation: 'fade',        // Animación por defecto
        duration: 100,
        delay: [1000, 100],           // Duración de la animación
        trigger: 'mouseenter'
    },
})
app.mount('#app')
