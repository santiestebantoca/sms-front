# Spec Base — Autenticación y sesión

| Campo | Valor |
|---|---|
| Módulo | `auth` |
| Estado | AS-IS (comportamiento actual) |
| Rutas | `/auth/*`, `/index`, `/home` |
| Archivos clave | `src/stores/auth/*`, `src/api/auth.ts`, `src/router/index.ts`, `src/views/auth/*`, `src/components/features/app/AppIdle.vue`, `src/main.ts` |

---

## 1. Propósito

Permitir el acceso de usuarios internos de ETECSA a la SPA mediante sesión por cookie, proteger las rutas privadas, cerrar sesión, expirar la sesión por inactividad y permitir que usuarios autorizados “personifiquen” a otro usuario.

---

## 2. Actores y permisos

| Actor | Capacidades |
|---|---|
| Visitante | Ver login; autenticarse. |
| Usuario autenticado | Acceder a `/index`, `/sms`, `/configurar`; cerrar sesión. |
| Usuario con `can_impersonate` | Buscar usuarios y personificar. |
| Usuario personificado (`is_impersonating`) | Usar la app como el usuario objetivo; puede volver a personificar. |
| Administrador (`admin: true`) | Ver la opción “Usuarios” en Configurar. La autorización real la aplica el backend. |

> El frontend **no** implementa RBAC completo: solo oculta navegación. No asumir que ocultar una opción equivale a denegar acceso.

---

## 3. Rutas

| Path | Name | Meta | Comportamiento |
|---|---|---|---|
| `/auth/login` | `auth-login` | `logout` | Login. `props.next` navega a `route.query.next` o `/home`. |
| `/auth/logout` | `auth-logout` | `logout` | Página de sesión terminada. |
| `/auth/expired` | `auth-expired` | `logout` | Sesión expirada; `beforeEnter` agrega `next=from.fullPath`. `props.next` navega a `route.query.next`. |
| `/auth/impersonate` | `auth-impersonate` | `requiresAuth` | Búsqueda y personificación. |
| `/index` | `index` | `requiresAuth` | Home autenticado. |
| `/home` | `home` | — | Alias `/`; redirige a `/index`. |

---

## 4. Componentes y stores

### Vistas

- `src/views/auth/index.vue` — layout de auth.
- `src/views/auth/login.vue` — formulario usuario/contraseña, alerta inline de credenciales inválidas.
- `src/views/auth/logout.vue` — confirmación visual de cierre.
- `src/views/auth/expired.vue` — aviso y botón “Continuar trabajando”.
- `src/views/auth/impersonate.vue` — buscador y listas de usuarios.
- `src/components/features/auth/impersonate/UserCard.vue`, `UsersList.vue`.

### Stores / composables

| Archivo | Responsabilidad |
|---|---|
| `src/stores/auth/useAuthQuery.ts` | `GET /auth/login`; usuario actual; `staleTime: Infinity`. |
| `src/stores/auth/useLogin.ts` | `POST /auth/login`; guarda el usuario en la caché de Colada. |
| `src/stores/auth/useLogout.ts` | `DELETE /auth/login`; setea el usuario a `null` en caché. |
| `src/stores/auth/useImpersonate.ts` | `POST /auth/impersonate/{userId}`; recarga la ventana. |
| `src/stores/auth/useImpersonateQuery.ts` | Búsqueda de usuarios con `search.length >= 2`; marca `actual`. |
| `src/composables/useAuthUserMenu.ts` | Acciones del menú de usuario; visibilidad de “Personificar”. |
| `src/components/features/app/AppIdle.vue` | Temporizador de inactividad y heartbeat. |
| `src/main.ts` | Evento global `unauthorized` → redirección a login. |

### Endpoints

| Método | Endpoint | Uso |
|---|---|---|
| `POST` | `/auth/login` | Autenticación con `{ username, password }`. |
| `GET` | `/auth/login` | Usuario actual (chequeo de sesión). |
| `DELETE` | `/auth/login` | Logout. |
| `POST` | `/auth/impersonate/{userId}` | Personificar. |
| `GET` | `/auth/users?search=` | Usuarios personificables. |
| `GET` | `/auth_groups/auth_groups` | Catálogo de roles/grupos (usado en usuarios). |

---

## 5. Flujos actuales

### 5.1 Arranque y guard de rutas

1. `router.beforeEach` detecta `meta.requiresAuth`.
2. Espera a que `isPending` de `useAuthQuery` sea `false` (`until(isPending).toBe(false)`).
3. Si `authUser` es `null`, redirige a `{ name: 'auth-login', query: { next: to.fullPath } }`.
4. Si hay usuario, continúa.

### 5.2 Login

1. `validate()` exige `username` y `password` no vacíos.
2. `useLogin().mutateAsync(credentials)` → `POST /auth/login`.
3. En éxito, `queryCache.setQueryData(queryKeys.auth.user(), () => data)`.
4. La vista ejecuta `props.next()`.
5. En fallo, el error se muestra inline en `BAlert` (“Credenciales no válidas”); **no** se emite toast global para el intento de login.

### 5.3 Logout

1. `router.afterEach` detecta `meta.logout` y, si hay usuario, ejecuta `useLogout()`.
2. `DELETE /auth/login`.
3. En éxito, el usuario en caché se setea a `null`.
4. La ruta `auth-logout` muestra “Sesión terminada por el usuario”.

### 5.4 401 global

1. El interceptor Axios detecta `401`.
2. Si **no** es la ruta de login, emite `error` (toast “Tu sesión ha expirado”).
3. Si **no** es un intento de login (`POST /auth/login`), emite `unauthorized`.
4. `main.ts` escucha `unauthorized` y, si no estamos ya en `auth-login`, hace:
   `router.push({ name: 'auth-login', query: { next: currentRoute.fullPath } })`.
5. Se lanza `AuthenticationError`.

### 5.5 Expiración por inactividad (`AppIdle`)

- `timeout = 1440` minutos (24 h).
- `warning = 0.7` → overlay a los 1008 min (16.8 h).
- `LISTENERS = timeout / 3` → a los 480 min (8 h) empieza a escuchar `mousemove`, `mousedown`, `keydown`, `touchstart`.
- Cada acceso al servidor (`lastServerAccess`) reinicia el temporizador.
- Al hacer heartbeat, se ejecuta `refetch` de `GET /auth/login`.
- Al cumplirse el timeout, `stop()` y emite `expired` → `router.push({ name: 'auth-expired' })`.
- La página `auth-expired` permite “Continuar trabajando” y navega a `next` (la ruta previa).

### 5.6 Personificación

1. Visible si `authUser.can_impersonate` o `authUser.is_impersonating`.
2. El buscador solo consulta con `search.length >= 2`.
3. `useImpersonateQuery` marca `actual: d.id === authUser.id`.
4. `useImpersonate().mutate(userId)` → `POST /auth/impersonate/{userId}`.
5. En éxito, `window.location.reload()`.
6. Mientras `is_impersonating`, el menú muestra “Personificado”.

---

## 6. Reglas de negocio actuales

| ID | Regla |
|---|---|
| `R-AUTH-01` | La sesión se transporta por cookie; no hay token en `localStorage` ni en headers manuales. |
| `R-AUTH-02` | Toda ruta con `meta.requiresAuth` exige usuario autenticado antes de renderizar. |
| `R-AUTH-03` | Un `401` en `POST /auth/login` **no** redirige ni muestra toast global; se muestra inline en el formulario. |
| `R-AUTH-04` | Un `401` en `GET /auth/login` (chequeo inicial) **no** muestra toast global. |
| `R-AUTH-05` | Un `401` en cualquier otra llamada redirige a login preservando `next`. |
| `R-AUTH-06` | Entrar a una ruta con `meta.logout` estando autenticado dispara logout en el servidor. |
| `R-AUTH-07` | La sesión expira a los 1440 min de inactividad; hay aviso visual al 70%. |
| `R-AUTH-08` | La actividad del usuario solo reinicia el temporizador después de 1/3 del timeout; antes de eso el temporizador corre aunque haya actividad. |
| `R-AUTH-09` | El heartbeat de sesión es `GET /auth/login`; cada respuesta del servidor también reinicia el temporizador. |
| `R-AUTH-10` | Personificar requiere `can_impersonate` o estar ya personificando; tras personificar se recarga toda la aplicación. |
| `R-AUTH-11` | `admin: true` es la única condición de UI para mostrar “Usuarios” en Configurar. |
| `R-AUTH-12` | `registration_key === 'blocked'` se muestra como “Bloqueado”; el bloqueo efectivo lo aplica el backend. |
| `R-AUTH-13` | El login declara que el usuario pertenece al dominio `etecsa.cu`; no hay validación local del dominio. |
| `R-AUTH-14` | El registro de usuarios no es público: solo un administrador crea usuarios. |

---

## 7. Contrato de datos usado por el frontend

### Usuario autenticado (`authUser`)

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `number \| string` | Comparación con usuario personificado. |
| `name` | `string` | Nombre visible en menú; comparación de autor de mensaje. |
| `username` | `string` | Mostrado en menú. |
| `admin` | `boolean` | Mostrar opción Usuarios. |
| `can_impersonate` | `boolean` | Mostrar/buscar personificación. |
| `is_impersonating` | `boolean` | Etiqueta “Personificado”. |

### Credenciales

```ts
interface LoginCredentials {
  username: string
  password: string
}
```

### Errores

- `AuthenticationError` (`401`), `AuthorizationError` (`403`), `NetworkError`, `ServerError`.
- Guardas: `isApiError`, `isNetworkError`, `isValidationError`.

---

## 8. Criterios de aceptación AS-IS

- **AC-AUTH-01** Dado un visitante sin sesión, al entrar a `/configurar/grupos` es redirigido a `/auth/login?next=/configurar/grupos`.
- **AC-AUTH-02** Con credenciales válidas, el login guarda el usuario y navega a `next` o `/home`.
- **AC-AUTH-03** Con credenciales inválidas, se muestra la alerta inline y no se navega.
- **AC-AUTH-04** Al entrar a `/auth/logout` con sesión, se ejecuta `DELETE /auth/login` y se limpia el usuario.
- **AC-AUTH-05** Tras 24 h sin actividad, se navega a `auth-expired` y se ofrece continuar.
- **AC-AUTH-06** Un `401` en una llamada de negocio redirige a login conservando la ruta actual en `next`.
- **AC-AUTH-07** Un usuario con `can_impersonate` puede buscar desde 2 caracteres y personificar; la app se recarga.
- **AC-AUTH-08** Un usuario sin `admin` no ve la opción “Usuarios”.

---

## 9. Límites y deuda conocida

- No hay refresh token ni renovación silenciosa; la sesión depende de la cookie del backend.
- El guard espera la query de auth, pero no revalida permisos por ruta.
- La personificación usa `window.location.reload()` y pierde estado de UI.
- `staleTime: Infinity` en `useAuthQuery` implica que el usuario en caché no se refresca salvo por login/logout/heartbeat/refetch explícito.
- No hay tests de auth.
- No se valida el dominio `etecsa.cu` en el cliente.
