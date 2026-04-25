import '@/assets/css/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { plugin as VueTippy } from 'vue-tippy' // Nota: importación nombrada 'plugin'
import 'tippy.js/dist/tippy.css'      // Estilos base
import 'tippy.js/themes/light.css'    // Tema claro (opcional)
import App from './App.vue'
import { router } from './router'
import { initAxiosInterceptors } from '@/api/client'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

// import mitt from 'mitt'
// export const emitter = mitt()

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(PiniaColada, {
  // Configuración global (opcional)
  // cache: {
  //     staleTime: 1000 * 60 * 5,   // 5 min antes de marcar como "stale"
  //     gcTime: 1000 * 60 * 30,     // 30 min antes de eliminar del cache
  // },
  // refetchOnWindowFocus: true,
})
app.use(router)
app.use(VueTippy, {
  directive: 'tippy',         // Nombre de la directiva (por defecto: 'tippy')
  component: 'tippy',         // Nombre del componente (por defecto: 'tippy')
  componentSingleton: 'tippy-singleton', // Para tooltips singleton (avanzado)
  defaultProps: {             // Props por defecto para todos los tooltips
    placement: 'bottom',        // Posición por defecto
    allowHTML: false,           // Por seguridad, no permitir HTML por defecto
    animation: 'fade',          // Animación por defecto
    duration: 100,              // Duración de la animación
    delay: [1000, 100],
    trigger: 'mouseenter'
  },
})

// Inicializar interceptor con dependencias ya creadas
initAxiosInterceptors({
  router,
  //   notify: (type, message) => {
  //     emitter.emit('show-toast', {
  //       message: message,
  //       variant: type === 'network'
  //         ? 'danger'
  //         : type === 'server' ? 'warning' : 'info'
  //     })
  //   }
})

app.mount('#app')
