# AGENTS.md — Guía operativa para OpenCode

> **Este archivo es obligatorio.** Cualquier agente o persona que modifique el repo debe leerlo antes de tocar código.
> El objetivo es preservar el comportamiento existente, evitar regresiones y permitir una migración ordenada a SDD/OpenSpec.

---

## 0. Orden de lectura antes de cualquier cambio

1. **`AGENTS.md`** (este archivo).
2. **`project-context.md`** — stack, arquitectura, convenciones, riesgos.
3. **`openspec/config.yaml`** — contexto y reglas de OpenSpec para este repo.
4. **La spec OpenSpec del módulo afectado**:
   - `openspec/specs/auth-sesion/spec.md`
   - `openspec/specs/directorio/spec.md`
   - `openspec/specs/mensajeria-sms/spec.md`
5. **El código real** del módulo (vistas, stores, api, tipos, rutas).
6. **Referencia histórica opcional:** `specs/_baseline/` contiene el snapshot AS-IS detallado (rutas, endpoints, contratos, deuda). No es la fuente de verdad; úsalo para contexto.
7. Si hay conflicto entre documentación y código, **gana el código actual**; documentar la discrepancia y preguntar antes de “corregir” la doc.

No empieces a editar hasta completar esta lectura.

---

## 1. Reglas estrictas (no negociables)

1. **No cambiar comportamiento sin spec aprobada.** Toda funcionalidad, corrección funcional o cambio de contrato nace como cambio OpenSpec en `openspec/changes/<change-id>/`.
2. **No modificar archivos core sin consultar.** Ver sección 2.
3. **No editar archivos generados:** `components.d.ts`, `dist/**`, `node_modules/**`.
4. **No tocar `.env*`** ni agregar secretos, IPs, tokens o credenciales al repo.
5. **No actualizar dependencias** ni cambiar `package.json`/`package-lock.json` sin autorización explícita.
6. **No hacer refactors masivos, formateos globales ni renombrados** de rutas, endpoints, campos o stores.
7. **No romper la arquitectura por capas:** las vistas no llaman a Axios ni a `fetch`; los componentes no contienen lógica de negocio pesada.
8. **No inventar endpoints, campos ni respuestas del backend.** Si no está en `src/api/*` o en una spec, preguntar.
9. **No duplicar manejo de errores.** Los errores globales ya los muestra el interceptor; `errorDeApi` es solo para 422.
10. **No cambiar la semántica de `continua`, `pertenece`, `grupo_b`, `label`, `registration_key`** sin spec y validación con negocio.
11. **Mantener el español** en textos de UI y nombres de dominio. No introducir i18n.
12. **Cambios pequeños y revisables.** Un cambio = un objetivo. No mezclar refactor + feature + upgrade.
13. **No ejecutar comandos destructivos** (`git reset --hard`, `git clean -fd`, borrados masivos) sin confirmación humana.
14. **No asumir que ocultar una opción de UI es autorización.** El backend es la autoridad.

---

## 2. Archivos core que requieren confirmación explícita

No modificar sin explicar el motivo y obtener aprobación:

- `src/main.ts`
- `src/App.vue`
- `src/router/index.ts`
- `src/api/client/client.ts`
- `src/api/client/errors.ts`
- `src/api/client/index.ts`
- `src/lib/query-keys.ts`
- `src/types/models.ts`
- `src/constants/index.ts`
- `src/constants/errorMessages.ts`
- `src/composables/useNotificaciones.ts`
- `src/composables/useErroresGlobalesToast.ts`
- `src/components/features/app/AppIdle.vue`
- `src/components/layout/Layout.vue`
- `src/layouts/*.vue`
- `vite.config.ts`, `tsconfig.json`, `eslint.config.js`
- `package.json`, `package-lock.json`
- `index.html`
- `.env`, `.env.corp`, `.env.corp.kk`, `.env.production`
- `components.d.ts` (generado)

Si el cambio es inevitable, indicar: **qué**, **por qué**, **impacto**, **cómo se verificó**.

---

## 3. Dónde va cada cosa

| Necesidad | Ubicación | Patrón |
|---|---|---|
| Página/ruta | `src/views/<dominio>/...` | `<script setup>`, template, style scoped |
| UI reutilizable | `src/components/commons/` | Componente genérico, sin dominio |
| UI de dominio | `src/components/features/<dominio>/` | Específico de auth/configurar/mensaje |
| Layout | `src/components/layout/` o `src/layouts/` | Composición de shell |
| Lógica reutilizable | `src/composables/useXxx.ts` | Sin HTTP directo |
| Query/mutation | `src/stores/<entidad>/use<Entidad><Operacion>.ts` | Pinia Colada |
| Barrel de stores | `src/stores/<entidad>/index.ts` | Reexportar |
| Endpoint | `src/api/<recurso>.ts` | Objeto con métodos finos |
| Clave de caché | `src/lib/query-keys.ts` | Jerárquica y tipada por convención |
| Tipo de dominio | `src/types/models.ts` | `interface`, IDs `number \| string` |
| Constante/patrón | `src/constants/index.ts` | Valores reutilizables |
| Utilidad pura | `src/utils/` | Sin estado ni Vue |
| Estilo global | `src/assets/css/` | Tokens/overrides/utilidades |

---

## 4. Recetas obligatorias

### 4.1 Agregar una operación de datos

1. Añadir el método en `src/api/<recurso>.ts` (solo `api.get/post/put/delete(...).then(r => r.data)`).
2. Añadir/ajustar la clave en `src/lib/query-keys.ts`.
3. Crear `src/stores/<entidad>/use<Entidad><Operacion>.ts`:
   - Query: `useQuery({ key, query, enabled, staleTime })`.
   - Mutación: `useMutation({ mutation, onMutate, onSuccess })`.
4. Reexportar en `src/stores/<entidad>/index.ts`.
5. Tipar el payload/response en `src/types/models.ts` si es un contrato nuevo.
6. Consumir desde la vista. **No** llamar a `api` desde la vista.

### 4.2 Agregar una ruta/vista

1. Crear la vista en `src/views/<dominio>/`.
2. Registrar la ruta en `src/router/index.ts` con:
   - `name` en kebab-case español,
   - `component: () => import(...)`,
   - `meta.requiresAuth` si aplica,
   - `props` como función si necesita callbacks.
3. Si es modal, usar ruta hija `crear`/`editar`/`eliminar` y navegar con `back`/`forward`.
4. Si es master-detail, respetar `showLista` y la ruta índice.
5. Actualizar `openspec/specs/<capability>/spec.md` si cambia el comportamiento.

### 4.3 Agregar un formulario

Seguir el patrón existente:

- `form` reactivo con valores iniciales.
- `errors` + `errorState` computado para `BFormGroup`.
- `validate()` local antes de mutar.
- `isValidationError(err)` para 422.
- `useNotificaciones().exito` para éxito; `errorDeApi` solo para 422.
- `BForm @submit.prevent`, `density="3"`, `trim`, `no-resize`.
- Navegación con `props.forward`/`props.back`.

### 4.4 Agregar un componente

- Si es genérico: `components/commons/`.
- Si es de dominio: `components/features/<dominio>/`.
- Nombre PascalCase.
- No agregar librerías de UI nuevas.
- Reutilizar `B*`, `BSearchInput`, `RootTree`/`TreeNode`, `BModalNext`/`BModalPlus`, `TablePagination`, etc.

---

## 5. Reglas de UI y estilos

- **Auto-imports:** `B*` y `I*` se auto-importan. No agregar imports manuales innecesarios. `UIcon` se usa para iconos dinámicos (`<UIcon :name="'lucide-...'" />`).
- **No editar `components.d.ts`.** Se regenera al correr Vite.
- **Bootstrap primero:** utilidades (`hstack`, `vstack`, `gap-*`, `text-*`, `w-*`, `border-*`).
- **Tokens propios:** `--bs-surface-*`, `--bs-brand`, escalas `--bs-<color>-*`.
- **Variantes custom:** `flat`, `flat-primary`, `flat-outline-*`, etc. Ya están declaradas en `src/vite-env.d.ts`.
- **SCSS scoped** y `:deep()` para BVN.
- **No estilos inline estáticos** si existe utilidad; se permiten custom properties dinámicas.
- **Textos en español**, sin i18n.
- **Fechas:** usar `src/composables/useDates.ts`; no formatear a mano.
- **Tooltips:** `v-tippy="'texto'"` o el objeto configurado.
- **Responsive:** usar `app:mobile` (provide de `App.vue`) cuando aplique.

---

## 6. Reglas de datos, errores y sesión

- Toda query usa una clave de `queryKeys`; nunca claves ad-hoc.
- Queries dependientes: `enabled: () => !!id` o `search.length >= 2`.
- Catálogos/detalles estables: `staleTime: Infinity`.
- Mutaciones: `cancelQueries` en `onMutate`, `invalidateQueries` en `onSuccess` (listas y detalles).
- No hacer actualizaciones optimistas salvo spec explícita.
- Errores:
  - 401 fuera de login → el interceptor redirige; no duplicar.
  - 422 → mostrar en el formulario; no toast global.
  - 403/404/500/red → toast global; no duplicar.
- Sesión:
  - No agregar tokens a `localStorage`.
  - No cambiar el guard ni `AppIdle` sin revisar `openspec/specs/auth-sesion/spec.md`.
  - No cambiar `staleTime: Infinity` de `useAuthQuery` sin analizar el heartbeat.
- Autorización:
  - `admin` solo controla visibilidad de “Usuarios”.
  - `can_impersonate`/`is_impersonating` controlan personificación.
  - El backend valida permisos reales.

---

## 7. Flujo SDD / OpenSpec

OpenSpec es la fuente de verdad del comportamiento. Las specs principales viven en `openspec/specs/` y los cambios en `openspec/changes/`.

### 7.1 Antes de implementar

1. Leer `openspec/config.yaml` y la spec de la capability afectada.
2. Crear el cambio:

```bash
npx.cmd --yes @fission-ai/openspec@latest new change "<change-id>"
```

3. Completar los artefactos que indique el estado del cambio:

```bash
npx.cmd --yes @fission-ai/openspec@latest status --change "<change-id>" --json
```

   - `proposal.md` — problema, valor, alcance y fuera de alcance.
   - `specs/<capability>/spec.md` — delta con `## ADDED` / `## MODIFIED` / `## REMOVED` / `## RENAMED Requirements`.
   - `design.md` — solo si el cambio lo requiere.
   - `tasks.md` — pasos pequeños y verificables.

4. Validar el cambio:

```bash
npx.cmd --yes @fission-ai/openspec@latest validate "<change-id>" --strict
```

5. Obtener aprobación humana antes de codificar.

### 7.2 Formato de las specs

- Requisitos en español, con `SHALL` o `MUST` en inglés.
- Cada requisito debe tener al menos un `#### Scenario:` con `WHEN` / `THEN`.
- Al modificar un requisito existente, citar su ID base (`R-AUTH-*`, `R-GRP-*`, `R-SMS-*`).
- Las specs describen comportamiento observable, no detalles internos de implementación.

### 7.3 Implementación

1. Implementar **solo** lo especificado en el cambio aprobado.
2. Mantener los cambios en los archivos previstos.
3. Si aparece un requisito no previsto, **detenerse y actualizar el cambio** antes de codificar.
4. Verificar manualmente el flujo afectado.

### 7.4 Cierre

1. Ejecutar `npm run typecheck` y `npm run build_sms`.
2. Ejecutar `npm run lint` si el entorno lo permite; si falla por configuración, reportar sin cambiarla.
3. Sincronizar o archivar el cambio:
   - `npx.cmd --yes @fission-ai/openspec@latest archive "<change-id>" -y`
   - o el skill `/openspec-sync-specs` si solo se actualizan las specs sin archivar.
4. Refrescar `specs/_baseline/` solo si se quiere conservar el snapshot histórico; no es obligatorio.
5. Registrar decisiones y riesgos en el PR/commit.
6. No dejar `console.log`, código comentado nuevo ni archivos temporales.

> Los skills de OpenSpec están en `.agents/skills/`. En OpenCode se invocan como `/openspec-propose`, `/openspec-apply-change`, `/openspec-archive-change`, etc.

---

## 8. Definition of Done

Un cambio está listo solo si:

- [ ] Tiene un cambio OpenSpec aprobado y `tasks.md` completado.
- [ ] El cambio pasa `openspec validate "<change-id>" --strict`.
- [ ] Respeta las capas y patrones existentes.
- [ ] No modifica archivos core sin justificación aprobada.
- [ ] No rompe rutas, nombres, endpoints ni contratos.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build_sms` pasa.
- [ ] El flujo manual afectado fue probado.
- [ ] Las specs principales de `openspec/specs/` quedaron actualizadas o archivadas.
- [ ] No hay secretos, logs temporales ni artefactos generados editados a mano.

---

## 9. Comandos de referencia

```bash
npm run dev          # desarrollo
npm run dev_corp     # desarrollo red corporativa
npm run build        # build estándar
npm run build_sms    # build de despliegue (/sms/static/)
npm run typecheck    # vue-tsc --noEmit
npm run lint         # ESLint
npm run lint:fix     # ESLint autofix

# OpenSpec (usar npx.cmd en Windows)
npx.cmd --yes @fission-ai/openspec@latest list --specs
npx.cmd --yes @fission-ai/openspec@latest validate --all
npx.cmd --yes @fission-ai/openspec@latest new change "<change-id>"
npx.cmd --yes @fission-ai/openspec@latest status --change "<change-id>"
npx.cmd --yes @fission-ai/openspec@latest archive "<change-id>" -y
```

---

## 10. Cuándo detenerse y preguntar

Detente y pide confirmación si:

- El cambio toca autenticación, sesión, interceptor, guard o idle.
- El cambio requiere un endpoint/campo que no existe en `src/api/*`.
- El cambio implica renombrar rutas, stores, campos o tablas.
- El cambio afecta la semántica de `continua`, `pertenece`, `grupo_b`, `label` o `registration_key`.
- El cambio requiere migración de datos o modificar el backend.
- Hay que actualizar dependencias o configuración de build.
- El código y la spec OpenSpec se contradicen.
- No hay forma de verificar el cambio (no hay tests).

**Ante la duda, no inventes: documenta la duda y pregunta.**

---

## 11. Mapa rápido de módulos

| Módulo | Spec OpenSpec | Snapshot histórico | Rutas | Stores principales |
|---|---|---|---|---|
| Auth/sesión | `openspec/specs/auth-sesion/spec.md` | `specs/_baseline/01-auth-sesion.md` | `/auth/*`, `/index` | `stores/auth/*` |
| Configuración | `openspec/specs/directorio/spec.md` | `specs/_baseline/02-configuracion-directorio.md` | `/configurar/**` | `stores/grupos`, `suscriptores`, `usuarios`, `plantillas`, `notificados` |
| Mensajería | `openspec/specs/mensajeria-sms/spec.md` | `specs/_baseline/03-mensajeria-sms.md` | `/sms/**` | `stores/mensajes`, `envios`, `notificaciones`, `notificados` |
