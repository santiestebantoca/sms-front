# auth-sesion Specification

## Purpose

Definir el comportamiento actual de autenticación y sesión de la SPA: login por cookie, protección de rutas privadas, logout, expiración por inactividad, manejo global de 401 y personificación de usuarios. Esta spec describe el estado AS-IS del frontend; el backend sigue siendo la autoridad de autorización.

## Requirements

### Requirement: Sesión basada en cookie

El sistema SHALL transportar la sesión exclusivamente mediante la cookie emitida por el backend, sin guardar tokens en `localStorage` ni construir cabeceras de autorización manuales.

#### Scenario: Petición autenticada

- **WHEN** el usuario autenticado realiza una petición a la API
- **THEN** el cliente Axios envía la cookie de sesión con `withCredentials: true`
- **AND** no se lee ni se escribe ningún token en `localStorage`

#### Scenario: Arranque sin cookie válida

- **WHEN** la aplicación arranca sin una cookie de sesión válida
- **THEN** `GET /auth/login` no devuelve usuario
- **AND** el guard trata al visitante como no autenticado

### Requirement: Protección de rutas privadas

El sistema SHALL exigir un usuario autenticado antes de renderizar cualquier ruta con `meta.requiresAuth`, preservando la ruta solicitada en el parámetro `next`.

#### Scenario: Acceso sin sesión

- **WHEN** un visitante sin sesión entra a `/configurar/grupos`
- **THEN** el router lo redirige a `/auth/login?next=/configurar/grupos`
- **AND** no se renderiza la vista protegida

#### Scenario: Acceso con sesión

- **WHEN** un usuario autenticado entra a una ruta con `meta.requiresAuth`
- **THEN** el guard espera a que termine la consulta `GET /auth/login`
- **AND** permite la navegación si hay usuario en caché

### Requirement: Inicio de sesión

El sistema SHALL autenticar con `POST /auth/login` usando `{ username, password }`, guardar el usuario devuelto en la caché de Pinia Colada y navegar a `next` o a `/home`. Un fallo de credenciales SHALL mostrarse inline en el formulario y no como toast global.

#### Scenario: Credenciales válidas

- **WHEN** el usuario envía credenciales válidas
- **THEN** la mutación guarda el usuario en `queryKeys.auth.user()`
- **AND** la vista navega a `route.query.next` o a `/home`

#### Scenario: Credenciales inválidas

- **WHEN** `POST /auth/login` responde `401`
- **THEN** el formulario muestra la alerta inline "Credenciales no válidas"
- **AND** no se emite toast global ni se redirige
- **AND** el usuario permanece en la pantalla de login

#### Scenario: Campos vacíos

- **WHEN** el usuario intenta enviar el formulario con `username` o `password` vacíos
- **THEN** la validación local bloquea el envío
- **AND** no se llama al backend

### Requirement: Cierre de sesión

El sistema SHALL ejecutar `DELETE /auth/login` al entrar a una ruta con `meta.logout` estando autenticado y SHALL limpiar el usuario de la caché.

#### Scenario: Logout explícito

- **WHEN** un usuario autenticado entra a `/auth/logout`
- **THEN** `router.afterEach` ejecuta la mutación de logout
- **AND** el cliente llama `DELETE /auth/login`
- **AND** el usuario en caché se establece en `null`
- **AND** la vista muestra "Sesión terminada por el usuario"

#### Scenario: Logout sin sesión

- **WHEN** un visitante sin usuario en caché entra a `/auth/logout`
- **THEN** no se ejecuta la llamada de logout
- **AND** se muestra la página de sesión terminada

### Requirement: Manejo global de errores 401

El sistema SHALL distinguir el `401` del intento de login del `401` de una llamada de negocio. Solo el segundo SHALL emitir el evento `unauthorized` y redirigir a login conservando la ruta actual en `next`.

#### Scenario: Chequeo inicial de sesión

- **WHEN** `GET /auth/login` responde `401` durante el arranque o el guard
- **THEN** no se muestra toast global
- **AND** no se emite el evento `unauthorized`

#### Scenario: Llamada de negocio no autorizada

- **WHEN** una llamada distinta de `POST /auth/login` responde `401`
- **THEN** el interceptor emite el toast "Tu sesión ha expirado"
- **AND** emite el evento `unauthorized`
- **AND** `main.ts` navega a `auth-login` con `next` igual a la ruta actual
- **AND** se lanza `AuthenticationError`

### Requirement: Expiración por inactividad

El sistema SHALL expirar la sesión tras 1440 minutos sin actividad, mostrar un aviso visual al 70% del tiempo y reiniciar el temporizador solo después de 1/3 del timeout o ante una respuesta del servidor.

#### Scenario: Aviso previo al vencimiento

- **WHEN** transcurren 1008 minutos (70% de 1440) sin reinicio del temporizador
- **THEN** `AppIdle` muestra el overlay de advertencia
- **AND** la sesión sigue activa

#### Scenario: Expiración

- **WHEN** se cumplen 1440 minutos sin actividad ni respuesta del servidor
- **THEN** `AppIdle` detiene el temporizador y emite `expired`
- **AND** el router navega a `auth-expired` conservando la ruta previa en `next`
- **AND** la página permite "Continuar trabajando" y volver a `next`

#### Scenario: Actividad temprana

- **WHEN** el usuario interactúa antes de cumplirse 1/3 del timeout
- **THEN** el temporizador no se reinicia
- **AND** la actividad solo empieza a escucharse a partir de los 480 minutos

#### Scenario: Heartbeat de sesión

- **WHEN** `AppIdle` ejecuta el heartbeat
- **THEN** se hace `refetch` de `GET /auth/login`
- **AND** cada acceso al servidor reinicia `lastServerAccess`

### Requirement: Personificación de usuarios

El sistema SHALL permitir personificar a otro usuario solo cuando el usuario actual tenga `can_impersonate` o ya esté personificando, buscar usuarios desde 2 caracteres y recargar la aplicación tras una personificación exitosa.

#### Scenario: Acceso a personificación

- **WHEN** `authUser.can_impersonate` es verdadero o `authUser.is_impersonating` es verdadero
- **THEN** el menú de usuario muestra la opción de personificar
- **AND** la ruta `auth-impersonate` es accesible para usuarios autenticados

#### Scenario: Búsqueda de usuarios

- **WHEN** el usuario escribe menos de 2 caracteres en el buscador
- **THEN** `useImpersonateQuery` no ejecuta la consulta
- **AND** la consulta se ejecuta al alcanzar 2 caracteres

#### Scenario: Personificación exitosa

- **WHEN** el usuario confirma la personificación de otro usuario
- **THEN** se llama `POST /auth/impersonate/{userId}`
- **AND** la aplicación se recarga con `window.location.reload()`
- **AND** mientras `is_impersonating` sea verdadero el menú muestra "Personificado"

### Requirement: Visibilidad administrativa y estado de bloqueo

El sistema SHALL usar `authUser.admin` como única condición de UI para mostrar la opción "Usuarios" y SHALL mostrar `registration_key === 'blocked'` como "Bloqueado". El bloqueo efectivo SHALL ser responsabilidad del backend.

#### Scenario: Usuario administrador

- **WHEN** `authUser.admin` es verdadero
- **THEN** la navegación de Configurar muestra la opción "Usuarios"

#### Scenario: Usuario no administrador

- **WHEN** `authUser.admin` es falso o ausente
- **THEN** la navegación de Configurar no muestra la opción "Usuarios"

#### Scenario: Usuario bloqueado

- **WHEN** un usuario tiene `registration_key === 'blocked'`
- **THEN** la UI lo muestra como "Bloqueado"
- **AND** el frontend no intenta aplicar el bloqueo por sí mismo

### Requirement: Registro de usuarios restringido

El sistema SHALL asumir que el registro de usuarios no es público y que solo un administrador puede crear usuarios desde la aplicación.

#### Scenario: Alta de usuario

- **WHEN** un usuario autenticado con `admin: true` accede a la creación de usuarios
- **THEN** la vista permite completar el formulario de alta
- **AND** el backend valida el permiso real antes de persistir
