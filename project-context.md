# Project Context — SMS (ETECSA)

> **Contexto persistente para agentes de IA y desarrolladores.**
> Leer este archivo completo antes de proponer o ejecutar cambios.
> Última revisión: 2026-11-12. Basado en el estado real del repositorio, no en documentación previa.

---

## 1. Resumen del producto

`sms` es una SPA interna de ETECSA para gestionar notificaciones SMS:

- Directorio jerárquico de **grupos**, **suscriptores** y **grupos notificados**.
- **Plantillas** de texto reutilizables.
- **Composición, envío y seguimiento** de mensajes SMS.
- **Usuarios**, roles/grupos de autenticación y **personificación** (impersonation).
- Sesión por cookie contra un backend REST externo, con expiración por inactividad.

| Dato | Valor |
|---|---|
| Ruta del repo | `D:\proyectos\vue-bs\sms` |
| Package | `sms` (`private: true`, `version: 0.0.0`) |
| Rama actual | `main` |
| Tipo de proyecto | Frontend SPA (el backend **no** está en este repo) |
| Idioma de la UI | Español (sin i18n) |
| Tests | **No existe suite de tests** ni framework configurado |
| CI/CD | No hay configuración de CI en el repo |

---

## 2. Stack tecnológico exacto

### 2.1 Runtime y framework

| Tecnología | Declarado en `package.json` | Instalado en `package-lock.json` | Uso |
|---|---:|---:|---|
| Vue | `^3.5.28` | **3.5.44** | Composition API + `<script setup>` |
| Vue Router | `^5.0.4` | **5.4.0** | Hash history, rutas anidadas |
| Pinia | `^4.1.0` | **4.1.0** | Solo registro; el estado de datos vive en Pinia Colada |
| `@pinia/colada` | `^1.1.0` | **1.4.9** | Queries/mutations, caché y claves |
| `@pinia/colada-plugin-auto-refetch` | `^0.2.6` | **0.2.7** | Auto-refetch global de queries |
| `pinia-plugin-persistedstate` | `^4.7.1` | **4.7.1** | Registrado, sin stores persistidos actualmente |
| Axios | `^1.13.6` | **1.21.0** | Cliente HTTP único |
| `mitt` | `^3.0.1` | **3.0.1** | Bus de eventos global (errores/401) |
| `@vueuse/core` | `^15.0.0` | **15.0.0** | Utilidades reactivas |
| `bootstrap` | `^5.3.8` | **5.3.8** | CSS base y utilidades |
| `bootstrap-vue-next` | `^1.2.2` | **1.2.2** | Componentes `B*` |
| `vue-tippy` | `^6.7.1` | **6.8.0** | Tooltips (`v-tippy`) |
| `vanillajs-datepicker` | `^1.3.4` | **1.3.4** | Datepicker |
| `@tidyjs/tidy` | `^2.6.0` | **2.6.1** | Instalado; uso actual comentado |
| `@popperjs/core` | `^2.11.8` | **2.11.8** | Dependencia de posicionamiento |

### 2.2 Build, tipos y calidad

| Herramienta | Declarado | Instalado |
|---|---:|---:|
| Vite | `^8.3.5` | **8.3.5** |
| `@vitejs/plugin-vue` | `^6.0.4` | **6.0.10** |
| TypeScript | `^5.9.3` | **5.9.3** |
| `vue-tsc` | `^3.3.9` | **3.3.14** |
| ESLint | `^10.8.1` | **10.14.0** |
| `eslint-plugin-vue` | `^10.12.0` | **10.12.0** |
| `@typescript-eslint/*` | `^8.67.0` | **8.72.1** |
| `vue-eslint-parser` | `^10.4.1` | **10.4.1** |
| Sass | `^1.63.4` | **1.107.1** |
| `unplugin-vue-components` | `^32.0.0` | **32.1.0** |
| `unplugin-icons` | `^24.0.0` | **24.0.0** |
| `@iconify/json` | `^2.2.552` | **2.2.552** |
| `vite-plugin-mkcert` | `^2.1.0` | **2.1.0** |

**Configuración TypeScript:** `strict: false`, `noImplicitAny: false`, `allowJs: true`, `noEmit: true`, alias `@/* → ./src/*`.

---

## 3. Comandos

| Comando | Efecto |
|---|---|
| `npm run dev` | Vite en modo desarrollo |
| `npm run dev_corp` | Vite con host `172.17.48.90` y modo `corp` |
| `npm run dev_corp_kk` | Vite con host `192.168.33.13` y modo `corp.kk` |
| `npm run build` | Build de producción |
| `npm run build_sms` | Build con `--base=/sms/static/` (despliegue real) |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint sobre `.js,.ts,.vue` |
| `npm run lint:fix` | ESLint con autofix |
| `npm run typecheck` | `vue-tsc --noEmit` |

**Verificación mínima antes de entregar cambios:** `npm run typecheck` y `npm run build_sms`.
Si `lint` falla por incompatibilidad de flags de ESLint 10, **no cambiar la configuración sin autorización**; reportar el fallo.

---

## 4. Entornos y despliegue

Variables de entorno (Vite expone solo `VITE_*`):

| Archivo | `VITE_API_URL` | Uso |
|---|---|---|
| `.env` | `https://localhost:8000/sms` | Desarrollo local |
| `.env.corp` | `https://172.17.48.90:8000/sms` | Red corporativa |
| `.env.corp.kk` | (URL corporativa alternativa) | Red corporativa KK |
| `.env.production` | `/sms` | Producción same-origin |

- `vite-plugin-mkcert` habilita HTTPS local (el backend usa HTTPS).
- El build real se sirve bajo `/sms/static/` y la API bajo `/sms`.
- `dist/` contiene un build previo con esa base; **no editar `dist/` a mano**.

> ⚠️ **Inconsistencia conocida:** `index.html` referencia `/src/main.js`, pero el archivo real es `src/main.ts`. Verificar el comportamiento de `dev`/`build` antes de tocar el entrypoint. No “corregirlo” de forma aislada sin validar el build completo.

---

## 5. Arquitectura general

### 5.1 Vista de alto nivel

```text
┌──────────────────────────────────────────────────────────────────┐
│ Navegador                                                        │
│  index.html → src/main.ts                                        │
│    ├─ BootstrapVueNext (BApp, defaults)                          │
│    ├─ Pinia + Pinia Colada (+ auto-refetch)                      │
│    ├─ Vue Router (hash history)                                  │
│    ├─ VueTippy                                                   │
│    └─ App.vue → AppPresentation / AppIdle / RouterView           │
└───────────────────────────┬──────────────────────────────────────┘
                            │
        ┌───────────────────┼────────────────────┐
        ▼                   ▼                    ▼
   views/ (páginas)   components/ (UI)     composables/ (lógica UI)
        │                   │                    │
        └───────────────────┼────────────────────┘
                            ▼
                 stores/ (Pinia Colada)
                 useXxxQuery / useXxxMutation
                            │
                            ▼
                 lib/query-keys.ts (claves)
                            │
                            ▼
                 api/*.ts (endpoints finos)
                            │
                            ▼
              api/client/client.ts (Axios único)
                            │
                            ▼
        Backend REST externo bajo VITE_API_URL
```

### 5.2 Capas y responsabilidades

| Capa | Ubicación | Responsabilidad | Regla |
|---|---|---|---|
| Entrada | `src/main.ts`, `src/App.vue` | Plugins globales, interceptor, evento 401, idle timer | Cambios sensibles; consultar |
| Rutas | `src/router/index.ts` | Definición de rutas, guards, props de navegación | No romper nombres ni estructura |
| Vistas | `src/views/` | Páginas, formularios, composición de UI | Delgadas; sin Axios directo |
| Componentes | `src/components/` | UI reutilizable (`commons`, `layout`, `features`) | Sin lógica de negocio pesada |
| Composables | `src/composables/` | Lógica reutilizable de UI/fechas/navegación/toasts | Sin llamadas HTTP directas |
| Stores | `src/stores/` | Queries/mutations Pinia Colada por entidad | Una operación por archivo + barrel |
| Claves | `src/lib/query-keys.ts` | Claves jerárquicas de caché | Toda query/mutation debe usarlas |
| API | `src/api/` | Un objeto por recurso, `.then(res => res.data)` | Axios solo aquí y en `client/` |
| Cliente | `src/api/client/` | Axios, interceptores, errores, eventos | Núcleo compartido; no modificar sin spec |
| Tipos | `src/types/models.ts` | Contratos TypeScript del dominio | Mantener compatibilidad |
| Constantes | `src/constants/` | Patrones, opciones, mensajes de error | Centralizar valores reutilizables |
| Estilos | `src/assets/css/` | Tokens, overrides, utilidades, SCSS | Respetar Bootstrap y `--bs-*` |

### 5.3 Flujo de datos (query)

```text
Vista/Componente
  └─ useXxxQuery(param)
       └─ useQuery({ key: () => queryKeys.xxx.lista(filtros), query: () => api.getAll(filtros) })
            └─ api.getAll → api.get('/recurso/recurso', { params }).then(r => r.data)
                 └─ Axios (withCredentials, baseURL, X-Requested-With, timeout 120s)
                      └─ Backend REST
```

- Las queries dependientes usan `enabled: () => !!id` o `enabled: () => search.length >= 2`.
- Catálogos y detalles usan `staleTime: Infinity` cuando no deben refrescarse solos.
- No hay actualizaciones optimistas: las mutaciones hacen `cancelQueries` y luego `invalidateQueries`.

### 5.4 Flujo de datos (mutation)

```text
Vista → useXxxCreate/Update/Delete
  └─ useMutation({
       mutation: (payload) => api.create(payload),
       onMutate: () => queryCache.cancelQueries({ key: queryKeys.xxx.listas() }),
       onSuccess: () => queryCache.invalidateQueries({ key: queryKeys.xxx.listas() })
     })
```

- Las actualizaciones invalidan `listas()` y `detalles()`; las eliminaciones normalmente solo `listas()`.
- El backend devuelve el recurso creado/actualizado; las vistas usan `nuevo.id` para navegar.

### 5.5 Flujo de errores y notificaciones

```text
Axios interceptor
  ├─ Sin response      → NetworkError + evento 'error' (network)
  ├─ 401               → AuthenticationError + evento 'error' (client, salvo login)
  │                       + evento 'unauthorized' (salvo intento de login)
  ├─ 403               → AuthorizationError + evento 'error' (client)
  ├─ 404               → NotFoundError + evento 'error' (client)
  ├─ 422               → ValidationError (sin toast global)
  ├─ 500/502/503/504   → ServerError + evento 'error' (server)
  └─ Otro              → ApiError + evento 'error' (unknown/network)
        │
        ├─ useErroresGlobalesToast (en App.vue) → toast deduplicado
        └─ evento 'unauthorized' (main.ts) → router.push('auth-login', { next })
```

- `useNotificaciones()` muestra éxitos, avisos y errores de validación locales.
- `errorDeApi(err, fallback)` **solo** muestra errores 422; el resto ya lo muestra el interceptor.
- Los formularios usan `isValidationError(err)` y asignan `err.errors` a su estado local.

### 5.6 Flujo de autenticación y sesión

```text
Router.beforeEach (requiresAuth)
  └─ useAuthQuery() → GET /auth/login (cookie)
       ├─ usuario → continúa
       └─ null    → auth-login?next=<fullPath>

Router.afterEach (meta.logout)
  └─ si hay usuario → useLogout() → DELETE /auth/login

AppIdle
  ├─ heartbeat → refetch GET /auth/login
  ├─ actividad después de 1/3 del timeout → reinicia
  ├─ warning (70%) → overlay
  └─ timeout (1440 min) → auth-expired?next=<ruta>

Evento 'unauthorized' (401)
  └─ si no estamos en login → auth-login?next=<ruta actual>
```

### 5.7 Layout y UI

- `MainLayout.vue` compone `Layout + Header + Footer + Drawer + PageContainer + Page`.
- `Layout.vue` provee `layout:window`, `layout:header`, `layout:left`, `layout:right`, `layout:footer`, `layout:page`, `layout:view` por `provide/inject`.
- `App.vue` provee `app:mobile` (breakpoint Bootstrap `md`).
- `BApp` aplica defaults globales: `BModal.scrollable`, `BPopover.delay`, `BToast.noProgress`.
- El layout usa un esquema propio tipo “app shell” (`view="hhh lPr fff"`), no un layout estándar de BVN.

---

## 6. Mapa de directorios

```text
sms/
├─ index.html                 # Entry HTML (ver inconsistencia main.js/main.ts)
├─ vite.config.ts             # Vue, mkcert, auto-imports, alias @
├─ tsconfig.json              # TS laxo, alias @/*
├─ eslint.config.js           # Flat config Vue + TS
├─ components.d.ts            # GENERADO por unplugin-vue-components (no editar)
├─ .env / .env.corp / .env.corp.kk / .env.production
├─ dist/                      # Build previo (no editar)
├─ openspec/                  # FUENTE DE VERDAD del comportamiento
│  ├─ config.yaml             # Contexto y reglas de OpenSpec
│  ├─ specs/                  # Specs principales por capability
│  └─ changes/                # Cambios propuestos + archive/
├─ .agents/skills/            # Skills de OpenSpec (propose, apply, archive...)
├─ specs/_baseline/           # Snapshot AS-IS histórico (referencia, no fuente de verdad)
├─ public/
└─ src/
   ├─ main.ts                 # Bootstrap de la app
   ├─ App.vue                 # BApp, presentación, idle, toasts globales
   ├─ router/index.ts         # Rutas + guards
   ├─ layouts/                # AuthLayout, MainLayout
   ├─ views/                  # Páginas por dominio
   │  ├─ auth/                # login, logout, expired, impersonate
   │  ├─ app/                 # home, index
   │  ├─ configurar/          # grupos, suscriptores, usuarios, plantillas
   │  └─ mensaje/             # home, componer, continuar, coleccion
   ├─ components/
   │  ├─ commons/             # BSearchInput, BModalNext/Plus, árbol, paginación...
   │  ├─ layout/              # Layout, Header, Footer, Drawer, Page...
   │  └─ features/            # UI específica de auth/configurar/mensaje/app
   ├─ composables/            # useNotificaciones, useNavigation, useDates...
   ├─ stores/                 # Un directorio por entidad + barrel index.ts
   ├─ api/                    # Un archivo por recurso + client/
   ├─ lib/query-keys.ts       # Claves de caché
   ├─ types/models.ts         # Interfaces del dominio
   ├─ constants/              # Patrones, opciones, mensajes
   ├─ utils/                  # flatToTree, helpers
   └─ assets/                 # SCSS, imágenes
```

---

## 7. Contrato de API observado

Prefijo: `VITE_API_URL` (ej. `/sms`). Todas las llamadas usan cookies (`withCredentials: true`) y `X-Requested-With: XMLHttpRequest`. Los módulos devuelven directamente `response.data`.

| Recurso | Endpoints usados | Parámetros observados |
|---|---|---|
| Auth | `POST /auth/login`, `DELETE /auth/login`, `GET /auth/login` | — |
| Auth | `POST /auth/impersonate/{userId}`, `GET /auth/users` | `search` |
| Auth groups | `GET /auth_groups/auth_groups` | — |
| Auth membership | `GET/PUT /auth_membership/auth_membership[/{id}]` | `usuario_id` |
| Usuarios | `GET/POST /usuarios/usuarios`, `GET/PUT/DELETE /usuarios/usuarios/{id}` | — |
| Grupos | `GET/POST /grupos/grupos`, `GET/PUT/DELETE /grupos/grupos/{id}` | `pertenece`, `label` |
| Suscriptores | `GET/POST /suscriptores/suscriptores`, `GET/PUT/DELETE /suscriptores/suscriptores/{id}` | `grupo` |
| Plantillas | `GET/POST /plantillas/plantillas`, `GET/PUT/DELETE /plantillas/plantillas/{id}` | `search` |
| Notificados | `GET/PUT /notificados/notificados[/{id}]` | `origen` |
| Notificaciones | `GET /notificaciones/notificaciones` | — |
| Mensajes | `GET /mensajes/notificaciones` | — |
| Mensajes | `GET/POST /mensajes/mensajes`, `GET/PUT /mensajes/mensajes/{id}` | `continua`, `desde`, `hasta`, `search` |
| Envíos | `GET /envios/envios` | `mensaje_id` |

**Convenciones del backend inferidas (confirmar con el equipo backend):**

- Nombres tipo `auth_groups`, `auth_membership`, `registration_key` y el uso de 422 sugieren un backend estilo web2py. **No asumir** framework ni esquema sin verificarlo.
- 422 normalizado como `{ message, errors }` o `{ campo: ["mensaje"] }`.
- Las listas suelen devolver arrays planos; los árboles se construyen en el frontend con `flatToTree`.
- `id` puede ser `number | string`; el código debe tolerar ambos.

---

## 8. Convenciones de código y estilo

### 8.1 Idioma y nombres

- **Dominio en español:** `grupo`, `suscriptor`, `plantilla`, `mensaje`, `notificado`, `envio`, `pertenece`, `suplente`, `apodo`.
- **Tecnicismos en inglés:** `query`, `mutation`, `store`, `payload`, `form`, `errors`, `loading`.
- Rutas con **kebab-case** y nombres en español: `configurar-grupo-suscriptor-editar`, `sms-componer-origenes`.
- Archivos de store: `use<Entidad><Operacion>.ts` (`useGrupoCreate.ts`, `useMensajesQuery.ts`).
- Componentes: PascalCase; componentes de feature agrupados por dominio.
- Composables: `useXxx.ts`; utilidades puras en `utils/`.

### 8.2 Estructura de SFC

Orden observado (no reordenar masivamente sin motivo):

1. `<script lang="ts" setup>`
2. `defineProps`/`defineEmits`/`defineModel` al inicio (a veces antes de los imports).
3. Imports.
4. Estado reactivo, computeds, handlers.
5. `<template>`
6. `<style scoped>` (o `scoped lang="scss"`).

- Se usa `<script setup>` en todas las vistas.
- No hay `defineOptions({ name })` salvo componentes especiales (`BModalNext`).

### 8.3 Auto-imports

- `unplugin-vue-components` + `BootstrapVueNextResolver` auto-importan componentes `B*`.
- `IconsResolver` + `unplugin-icons` auto-importan iconos con prefijo `I`:
  - `<ILucidePlus />`, `<ILucideUserX />`, `<IBiSendFill />`.
  - Iconos dinámicos: `<UIcon :name="'lucide-settings'" />`.
- `components.d.ts` es **generado**. No editarlo a mano.
- Algunos archivos importan `BButton` explícitamente (p. ej. `logout.vue`); ambos patrones existen. Mantener el estilo del archivo que se edite.

### 8.4 Patrón de stores (Pinia Colada)

- Una operación por archivo: `useXxxQuery`, `useXxxCreate`, `useXxxUpdate`, `useXxxDelete`, `useXxxSend`.
- Barrel `index.ts` por entidad que reexporta.
- `useQuery` con `key` **siempre** desde `queryKeys`.
- `useMutation` con `onMutate` (cancel) y `onSuccess` (invalidate).
- No crear stores Pinia clásicos (`defineStore`) para datos remotos; el patrón es Colada.
- `defineQuery` se usa en composables compuestos (`useImpersonateQuery`, `useMensajesQuery`).

### 8.5 Patrón de formularios

```ts
const form = ref<XxxCreate>({ ... })
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  campo: {
    state: errors.value.campo ? false : null,
    invalidFeedback: errors.value.campo,
    onInput: () => errors.value.campo = null
  }
}))
const validate = () => { /* reglas locales */ }
const submit = () => {
  if (!validate()) return
  crear(form.value)
    .then((nuevo) => { exito('...'); props.forward(nuevo.id) })
    .catch((err) => {
      if (isValidationError(err)) errors.value = err.errors
      errors.value.form = 'Error al ...'
    })
}
```

- Los errores de servidor se muestran vía `errorState` en `BFormGroup`.
- Los formularios usan `BForm @submit.prevent`, `density="3"`, `trim`, `no-resize`.
- Los modales de crear/editar/eliminar son **rutas hijas**, no estado local de la vista padre.

### 8.6 Router

- `createWebHashHistory()`.
- Rutas **lazy** (`() => import(...)`).
- `props` como función para inyectar callbacks de navegación (`forward`, `back`, `setXxxId`, `next`).
- Patrón **master-detail**: la ruta índice muestra lista; la ruta hija muestra detalle; `showLista` decide el estado vacío.
- Modales como rutas: `crear`, `editar`, `eliminar`; el modal se abre en `onMounted` y al cerrarse navega con `back`/`forward`.
- `meta.requiresAuth` en rutas protegidas; `meta.logout` en login/logout/expired.
- `/:pathMatch(.*)*` → `not_found.vue`.
- `home` (`/` y `/home`) redirige a `/index`.

### 8.7 Estilos

- Bootstrap 5 como base; se usan utilidades (`hstack`, `vstack`, `gap-*`, `text-*`, `w-*`).
- Tokens propios en `_tokens.scss` (`--bs-surface-*`, `--bs-brand`, escalas de color).
- Variantes custom de botón `flat`, `flat-primary`, `flat-outline-*`, etc., declaradas en `src/vite-env.d.ts`.
- SCSS scoped; `:deep()` para penetrar componentes BVN.
- No usar estilos inline estáticos si existe utilidad; se permiten custom properties dinámicas (`:style="{ '--x': ... }"`).
- Iconos de color: `text-teal`, `text-pink`, `text-yellow`, `text-success-400`, `text-gray-*`.

### 8.8 Fechas

- `src/composables/useDates.ts` centraliza parseo y formato.
- El backend envía `"YYYY-MM-DD HH:mm:ss"` (hora local, sin zona).
- Formatos de UI: `shortTime` (“Hoy 14:30”, “Ayer 10:15”, “12 Mar 08:00”), `listTime`, `formatTime` (`DD/MM/YYYY HH:mm`), `formatDate`, `formatHM`.
- `useDateTime` es singleton con intervalo de 1 segundo y conteo de consumidores.

### 8.9 TypeScript

- `strict: false` y `noImplicitAny: false`: hay `any` y `null` en campos tipados como `string`.
- No introducir `strict` ni refactors masivos de tipos sin spec aprobada.
- Los contratos nuevos van en `src/types/models.ts`.
- `id` siempre `number | string` cuando aplique.

### 8.10 Testing y calidad

- No hay tests unitarios/E2E.
- No hay Prettier ni Biome configurados.
- ESLint es la única verificación estática además de `vue-tsc`.
- Los commits recientes usan mensajes genéricos (“Update”); no hay convención estricta. Para cambios nuevos, usar mensajes descriptivos.

---

## 9. Deuda técnica y riesgos conocidos

| # | Riesgo | Impacto | Acción recomendada |
|---|---|---|---|
| 1 | `index.html` apunta a `/src/main.js` y el archivo es `main.ts` | El dev/build podría fallar según resolución de Vite | Verificar antes de tocar el entrypoint; no cambiar a ciegas |
| 2 | Sin tests | Regresiones silenciosas | Añadir tests al migrar a SDD, no antes |
| 3 | `strict: false` + `any` | Errores de contrato no detectados | Tipar incrementalmente por módulo |
| 4 | `.env*` versionados con IPs internas | Fuga de infraestructura / rigidez | Mover a variables de entorno del despliegue |
| 5 | `components.d.ts` generado | Conflictos si se edita | Regenerar con Vite, nunca editar |
| 6 | `lint` con `--ext` en ESLint 10 flat config | Posible incompatibilidad | Validar; no cambiar config sin autorización |
| 7 | `pinia-plugin-persistedstate` sin stores persistidos | Código muerto aparente | Confirmar antes de eliminar |
| 8 | `@tidyjs/tidy` sin uso activo | Dependencia innecesaria | Confirmar antes de eliminar |
| 9 | `useAuthQuery` con `staleTime: Infinity` | La sesión solo se refresca por heartbeat/refetch | No cambiar sin revisar AppIdle y guard |
| 10 | Personificación recarga toda la app | Mala UX / estado perdido | Candidato a mejora con spec |
| 11 | `ListaDestinatarios.vue` (global) inicializa `useEnviosQuery()` sin id y lo asigna en `@show` | Primera carga sin datos | Revisar al tocar el módulo de mensajes |
| 12 | Textos duplicados/typos (“Admnistrador”, “Error al crear el grupo” en suscriptores) | Inconsistencia de UI | Corregir solo con spec de cambios |
| 13 | Algunos `catch` hacen `errors.value = err.errors` y luego `errors.value.form = ...` | Puede perder errores previos | No replicar el patrón; corregir con spec |

---

## 10. Cómo usar este contexto con SDD / OpenSpec

1. **Antes de cambiar código**, leer:
   - `AGENTS.md` (reglas operativas).
   - Este `project-context.md`.
   - `openspec/config.yaml` y la spec de la capability afectada en `openspec/specs/`.
   - `specs/_baseline/` solo como snapshot histórico detallado.
2. **OpenSpec es la fuente de verdad del comportamiento**:
   - Specs principales: `openspec/specs/<capability>/spec.md`.
   - Cambios: `openspec/changes/<change-id>/` (`proposal.md`, `specs/`, `design.md`, `tasks.md`).
   - Skills disponibles en `.agents/skills/`: `/openspec-propose`, `/openspec-apply-change`, `/openspec-archive-change`, `/openspec-explore`, `/openspec-sync-specs`, `/openspec-update-change`.
3. **Toda funcionalidad o corrección** debe nacer como cambio OpenSpec y validarse con `openspec validate "<change-id>" --strict` antes de implementar.
4. **Al cerrar**, archivar o sincronizar el cambio para que `openspec/specs/` refleje el nuevo comportamiento.
5. **No mezclar** refactors, upgrades de dependencias y cambios funcionales en un mismo cambio.

---

## 11. Referencias rápidas

- Punto de entrada: `src/main.ts`
- Cliente HTTP: `src/api/client/client.ts`
- Errores: `src/api/client/errors.ts`
- Claves de caché: `src/lib/query-keys.ts`
- Tipos: `src/types/models.ts`
- Rutas: `src/router/index.ts`
- Navegación: `src/composables/useNavigation.ts`
- Notificaciones: `src/composables/useNotificaciones.ts`
- Errores globales: `src/composables/useErroresGlobalesToast.ts`
- Fechas: `src/composables/useDates.ts`
- Layout: `src/components/layout/Layout.vue`
- Idle/sesión: `src/components/features/app/AppIdle.vue`
