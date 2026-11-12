# Spec Base — Configuración / Directorio

| Campo | Valor |
|---|---|
| Módulo | `configurar` |
| Estado | AS-IS (comportamiento actual) |
| Rutas | `/configurar/**` |
| Archivos clave | `src/views/configurar/**`, `src/stores/{grupos,suscriptores,usuarios,plantillas,notificados,auth-groups,auth-membership}/**`, `src/api/{grupos,suscriptores,usuarios,plantillas,notificados,auth-groups,auth-membership}.ts` |

---

## 1. Propósito

Administrar el directorio organizacional usado por el módulo de mensajería:

- **Grupos** jerárquicos, sus etiquetas y relaciones.
- **Suscriptores** (personas notificables) y su grupo/suplente.
- **Grupos notificados** por grupo (qué grupos reciben notificaciones de un origen).
- **Usuarios** de la aplicación y sus grupos de autenticación.
- **Plantillas** de texto reutilizables.

---

## 2. Actores y permisos

| Actor | Capacidades |
|---|---|
| Usuario autenticado | Ver y gestionar grupos, suscriptores y plantillas. |
| Administrador (`admin: true`) | Además, ver y gestionar usuarios. |

> La restricción de “Usuarios” es solo de navegación/UI. El backend debe aplicar la autorización real.

---

## 3. Rutas

### 3.1 Grupos

| Path | Name | Props / comportamiento |
|---|---|---|
| `/configurar/grupos` | `configurar-grupos` | Lista + estado vacío (`showLista`). |
| `/configurar/grupos/crear` | `configurar-grupos-crear` | Formulario de creación; `back` respeta `?back`. |
| `/configurar/grupos/:grupoId` | `configurar-grupo` | Detalle con tabs General / Grupos / Suscriptores / Notificados. |
| `.../:grupoId/editar` | `configurar-grupo-editar` | Modal de edición. |
| `.../:grupoId/eliminar` | `configurar-grupo-eliminar` | Modal de eliminación en cascada. |
| `.../:grupoId/hijos/crear` | `configurar-grupo-hijos-crear` | Modal de subgrupo; `pertenece = grupoId`. |
| `.../hijos/:hijoId/editar` | `configurar-grupo-hijo-editar` | Modal de edición del subgrupo. |
| `.../hijos/:hijoId/eliminar` | `configurar-grupo-hijo-eliminar` | Modal de eliminación del subgrupo. |
| `.../suscriptores/crear` | `configurar-grupo-suscriptores-crear` | Crea suscriptor con `grupo = grupoId`. |
| `.../suscriptores/:suscriptorId/editar` | `configurar-grupo-suscriptor-editar` | Edición de suscriptor del grupo. |
| `.../suscriptores/:suscriptorId/eliminar` | `configurar-grupo-suscriptor-eliminar` | Eliminación de suscriptor del grupo. |
| `.../notificados/editar` | `configurar-grupo-notificados-editar` | Selección de grupos notificados (`grupo_b`). |

### 3.2 Suscriptores

| Path | Name |
|---|---|
| `/configurar/suscriptores` | `configurar-suscriptores` |
| `/configurar/suscriptores/crear` | `configurar-suscriptores-crear` |
| `/configurar/suscriptores/:suscriptorId` | `configurar-suscriptor` |
| `.../:suscriptorId/editar` | `configurar-suscriptor-editar` |
| `.../:suscriptorId/eliminar` | `configurar-suscriptor-eliminar` |

### 3.3 Usuarios

| Path | Name |
|---|---|
| `/configurar/usuarios` | `configurar-usuarios` |
| `/configurar/usuarios/crear` | `configurar-usuarios-crear` |
| `/configurar/usuarios/:usuarioId` | `configurar-usuario` |
| `.../:usuarioId/editar` | `configurar-usuario-editar` |
| `.../:usuarioId/eliminar` | `configurar-usuario-eliminar` |

### 3.4 Plantillas

| Path | Name |
|---|---|
| `/configurar/plantillas` | `configurar-plantillas` |
| `/configurar/plantillas/crear` | `configurar-plantillas-crear` |
| `/configurar/plantillas/:plantillaId` | `configurar-plantilla` |
| `.../:plantillaId/editar` | `configurar-plantilla-editar` |
| `.../:plantillaId/eliminar` | `configurar-plantilla-eliminar` |

> Patrón común: la ruta índice muestra la lista y la ruta hija el detalle. Los modales se abren en `onMounted` y navegan con `back`/`forward` al cerrarse.

---

## 4. Componentes y stores

### 4.1 Grupos

| Archivo | Responsabilidad |
|---|---|
| `views/configurar/grupos/index.vue` | Árbol de grupos + creación. |
| `views/configurar/grupos/[id]/index.vue` | Detalle + `provide('grupo:grupo')`. |
| `components/features/configurar/grupos/GrupoCard.vue` | Datos generales + acciones. |
| `GrupoHijosCard.vue` | Subgrupos (`GET /grupos/grupos?pertenece=`). |
| `GrupoSuscriptoresCard.vue` | Suscriptores del grupo. |
| `GrupoNotificadosCard.vue` | Grupos notificados del grupo. |
| `stores/grupos/useGruposQuery.ts` | Árbol completo, hijos, notificables, orígenes. |
| `stores/grupos/useGrupoQuery.ts` | Detalle por id. |
| `stores/grupos/useGrupoCreate/Update/Delete.ts` | Mutaciones. |
| `utils/flatToTree.ts` | Convierte lista plana en árbol (`parentKey: 'pertenece'`). |

**Variantes de consulta de grupos:**

| Función | Query | Uso |
|---|---|---|
| `useGruposQuery()` | `getAll()` + `flatToTree` | Árbol completo de configuración. |
| `useGruposDelGrupoQuery(padreId)` | `getAll({ pertenece })` | Hijos de un grupo. |
| `useGruposNotificablesQuery()` | `getAll({ label: 'grupo,centro' })` | Grupos que pueden ser notificados. |
| `useGruposOrigenesQuery()` | `getAll({ label: 'centro,origen' })` | Grupos que pueden ser origen de SMS. |

### 4.2 Suscriptores

| Archivo | Responsabilidad |
|---|---|
| `views/configurar/suscriptores/index.vue` | Lista con icono activo/inactivo. |
| `views/configurar/suscriptores/[id]/index.vue` | Detalle + `provide('suscriptor:suscriptor')`. |
| `components/features/configurar/suscriptores/SuscriptorCard.vue` | Datos + acciones. |
| `SeleccionarGrupo.vue` | Modal/árbol para elegir grupo. |
| `stores/suscriptores/*` | Query de lista, del grupo, detalle, create/update/delete. |

### 4.3 Usuarios y autenticación

| Archivo | Responsabilidad |
|---|---|
| `views/configurar/usuarios/index.vue` | Lista; `registration_key === 'blocked'` en rojo. |
| `views/configurar/usuarios/[id]/index.vue` | Detalle + `provide('usuario:usuario')`. |
| `views/configurar/usuarios/crear.vue` | Creación (sin `registration_key`). |
| `views/configurar/usuarios/[id]/editar.vue` | Edición (incluye `registration_key`). |
| `stores/usuarios/*` | CRUD de usuarios. |
| `stores/auth-groups/useAuthGroupsQuery.ts` | Catálogo de roles/grupos. |
| `stores/auth-membership/*` | Membresías (consulta/actualización). |

### 4.4 Plantillas

| Archivo | Responsabilidad |
|---|---|
| `views/configurar/plantillas/index.vue` | Lista + búsqueda. |
| `views/configurar/plantillas/crear.vue` | Creación. |
| `views/configurar/plantillas/[id]/index.vue` | Detalle mínimo. |
| `components/features/configurar/plantillas/PlantillaCard.vue` | Tarjeta con acciones. |
| `stores/plantillas/*` | Lista, búsqueda, detalle, create/update/delete. |
| `useWidgetPlantillasQuery` | Búsqueda desde el compositor, solo con `search.length >= 2`. |

### 4.5 Notificados

| Archivo | Responsabilidad |
|---|---|
| `stores/notificados/useNotificadosQuery.ts` | Notificados por origen o por grupo. |
| `stores/notificados/useNotificadosUpdate.ts` | Reemplaza `grupo_b` de un grupo. |
| `views/configurar/grupos/[id]/notificados/editar.vue` | Árbol de grupos notificables + checkboxes. |

---

## 5. Endpoints

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/grupos/grupos` | Lista/árbol; params `pertenece`, `label`. |
| `POST` | `/grupos/grupos` | Crear grupo. |
| `GET` | `/grupos/grupos/{id}` | Detalle. |
| `PUT` | `/grupos/grupos/{id}` | Actualizar. |
| `DELETE` | `/grupos/grupos/{id}` | Eliminar en cascada. |
| `GET` | `/suscriptores/suscriptores` | Lista; param `grupo`. |
| `POST` | `/suscriptores/suscriptores` | Crear. |
| `GET` | `/suscriptores/suscriptores/{id}` | Detalle. |
| `PUT` | `/suscriptores/suscriptores/{id}` | Actualizar. |
| `DELETE` | `/suscriptores/suscriptores/{id}` | Eliminar. |
| `GET` | `/usuarios/usuarios` | Lista. |
| `POST` | `/usuarios/usuarios` | Crear. |
| `GET` | `/usuarios/usuarios/{id}` | Detalle. |
| `PUT` | `/usuarios/usuarios/{id}` | Actualizar. |
| `DELETE` | `/usuarios/usuarios/{id}` | Eliminar. |
| `GET` | `/auth_groups/auth_groups` | Catálogo de grupos/roles. |
| `GET` | `/auth_membership/auth_membership` | Membresías; param `usuario_id`. |
| `PUT` | `/auth_membership/auth_membership/{id}` | Actualizar membresía. |
| `GET` | `/plantillas/plantillas` | Lista; param `search`. |
| `POST` | `/plantillas/plantillas` | Crear. |
| `GET` | `/plantillas/plantillas/{id}` | Detalle. |
| `PUT` | `/plantillas/plantillas/{id}` | Actualizar. |
| `DELETE` | `/plantillas/plantillas/{id}` | Eliminar. |
| `GET` | `/notificados/notificados` | Notificados; param `origen`. |
| `PUT` | `/notificados/notificados/{id}` | Reemplazar `grupo_b`. |

---

## 6. Reglas de negocio actuales

### 6.1 Grupos

| ID | Regla |
|---|---|
| `R-GRP-01` | Un grupo tiene `nombre` obligatorio; `apodo`, `label` y `descripcion` son opcionales. |
| `R-GRP-02` | La jerarquía se expresa con `pertenece` (id del padre). Si es `null` o el padre no existe, el grupo es raíz. |
| `R-GRP-03` | El árbol se construye en el frontend con `flatToTree(data, { parentKey: 'pertenece' })`; el backend devuelve lista plana. |
| `R-GRP-04` | Crear un subgrupo desde el detalle envía `pertenece = padreId`. |
| `R-GRP-05` | `label === 'origen'` identifica grupos seleccionables como origen de SMS (icono verde). El resto usa icono amarillo. |
| `R-GRP-06` | Las consultas de notificables/orígenes filtran por `label` con valores `grupo,centro` y `centro,origen`; el backend interpreta esos filtros. |
| `R-GRP-07` | Eliminar un grupo elimina permanentemente el grupo, sus grupos hijos y los suscriptores de esos grupos (según el texto de confirmación). |
| `R-GRP-08` | El detalle muestra tabs General, Grupos, Suscriptores y Notificados; Grupos/Suscriptores/Notificados son `lazy`. |
| `R-GRP-09` | La lista de grupos usa `RootTree` + `TreeNode` con indentación por nivel y estado activo/descendiente activo. |
| `R-GRP-10` | El alta/edición de grupo no permite elegir `pertenece` desde el formulario general; el padre se fija por la ruta de creación de hijos. |

### 6.2 Suscriptores

| ID | Regla |
|---|---|
| `R-SUS-01` | `nombre` es obligatorio. |
| `R-SUS-02` | `telefono` es obligatorio y debe cumplir `MOVIL_PATRON = /^(\+53\|53)?\d{8}$/`. |
| `R-SUS-03` | `correo` es opcional; si existe, debe cumplir `EMAIL_PATRON`. |
| `R-SUS-04` | `grupo` es obligatorio en el alta/edición global. En el alta desde un grupo, se precarga `grupo = grupoId` y no se valida en el cliente. |
| `R-SUS-05` | `activo` por defecto es `true`; se muestra “Sí/No” y en la lista con icono verde/rojo. |
| `R-SUS-06` | `suplente` es opcional y se elige de la lista completa de suscriptores. |
| `R-SUS-07` | Eliminar un suscriptor conserva los registros históricos asociados (según el texto de confirmación). |
| `R-SUS-08` | El detalle de suscriptor muestra `grupo`, `suplente`, `modified_by` y `modified_on`; en edición se usan `grupo_id` y `suplente_id` del detalle. |

### 6.3 Usuarios

| ID | Regla |
|---|---|
| `R-USR-01` | `first_name`, `last_name` y `username` son obligatorios. |
| `R-USR-02` | `grupos` es un arreglo de ids de `auth_groups`; se edita con checkboxes. |
| `R-USR-03` | `registration_key` solo se edita en el formulario de edición: `null` = Activo, `'blocked'` = Bloqueado. |
| `R-USR-04` | El alta no expone `registration_key`; el usuario nace activo por defecto. |
| `R-USR-05` | La lista marca en rojo y con icono `UserX` a los usuarios con `registration_key === 'blocked'`. |
| `R-USR-06` | Eliminar un usuario elimina también sus mensajes enviados (según el texto de confirmación). Se sugiere bloquear en lugar de eliminar. |
| `R-USR-07` | La opción “Usuarios” solo se muestra si `authUser.admin` es verdadero. |
| `R-USR-08` | El detalle muestra `first_name + last_name`, `username`, roles de `grupos`, estado de `registration_key`, `modified_by/on`. |
| `R-USR-09` | El catálogo de roles (`auth_groups`) usa `staleTime: Infinity`. |

### 6.4 Plantillas

| ID | Regla |
|---|---|
| `R-PLT-01` | `texto` es obligatorio. |
| `R-PLT-02` | La búsqueda de plantillas es server-side (`?search=`). |
| `R-PLT-03` | En el compositor, el widget de plantillas solo busca con `search.length >= 2`. |
| `R-PLT-04` | Insertar una plantilla **concatena** su texto al cuerpo actual; no lo reemplaza. |
| `R-PLT-05` | Guardar plantilla desde el compositor crea una plantilla con el texto actual. |
| `R-PLT-06` | Eliminar una plantilla es permanente. |

### 6.5 Notificados

| ID | Regla |
|---|---|
| `R-NOT-01` | “Notificados” de un grupo es el conjunto de grupos que reciben sus notificaciones, guardado en `grupo_b` (arreglo de ids). |
| `R-NOT-02` | La edición reemplaza el conjunto completo: `PUT /notificados/notificados/{grupoId}` con `{ grupo_b: [...] }`. |
| `R-NOT-03` | El árbol de selección usa `GET /grupos/grupos?label=grupo,centro` y permite marcar cualquier grupo. |
| `R-NOT-04` | La consulta de notificados de un grupo usa `GET /notificados/notificados?origen={grupoId}`. |
| `R-NOT-05` | No hay validación local de que `grupo_b` no esté vacío. |

### 6.6 Patrones transversales de configuración

| ID | Regla |
|---|---|
| `R-CFG-01` | Toda operación de escritura invalida las listas correspondientes; las actualizaciones invalidan además los detalles. Las eliminaciones normalmente solo invalidan listas. |
| `R-CFG-02` | Los errores 422 se reflejan en `errorState` del formulario; los demás ya se notifican globalmente. |
| `R-CFG-03` | Tras crear, se navega al detalle del nuevo recurso usando el `id` devuelto. |
| `R-CFG-04` | Los modales de edición/eliminación se cierran con `back`; tras eliminar, con `forward` a la lista. |
| `R-CFG-05` | No se hace borrado optimista: primero responde el servidor y luego se invalida la caché. |

---

## 7. Contratos de datos usados por el frontend

```ts
interface AuthGroup {
  id: number | string
  role: string
  description: string | null
}

interface UsuarioDetalle {
  id: number | string
  first_name: string
  last_name: string
  username: string
  registration_key: string | null
  grupos: AuthGroup[]
  modified_by: string | null
  modified_on: string | null
}

interface UsuarioCreate {
  first_name: string
  last_name: string
  username: string
  grupos: (number | string)[]
}

interface UsuarioUpdate extends UsuarioCreate {
  id: number | string
  registration_key?: string
}

interface GrupoCreate {
  nombre: string
  apodo?: string
  label?: string
  descripcion?: string
  pertenece?: number | string
}

interface GrupoUpdate extends GrupoCreate {
  id: number | string
}

interface SuscriptorCreate {
  nombre: string
  cargo?: string
  telefono?: string
  correo?: string
  grupo?: number | string
  activo?: boolean
  suplente?: number | string
}

interface SuscriptorUpdate extends Partial<SuscriptorCreate> {
  id: number | string
}

interface PlantillaCreate {
  texto: string
}

interface PlantillaUpdate extends PlantillaCreate {
  id: number | string
}

interface NotificadosUpdate {
  id: number | string
  grupo_b: (number | string)[]
}
```

**Campos adicionales consumidos sin tipar:** `grupo_id`, `suplente_id`, `modified_by`, `modified_on`, `suscriptores`, `children`.

---

## 8. Criterios de aceptación AS-IS

- **AC-CFG-01** Crear un grupo sin nombre muestra “Este campo no puede estar vacío” y no llama al backend.
- **AC-CFG-02** Un grupo creado desde “hijos/crear” aparece como hijo del grupo actual y se envía con `pertenece`.
- **AC-CFG-03** Eliminar un grupo muestra la advertencia de cascada (grupo, hijos y suscriptores) antes de ejecutar.
- **AC-CFG-04** Crear un suscriptor con teléfono inválido muestra “Formato no válido” y no envía.
- **AC-CFG-05** Un suscriptor sin correo es válido.
- **AC-CFG-06** Crear un usuario exige nombre, apellidos y username; los grupos son opcionales.
- **AC-CFG-07** Editar un usuario permite cambiar `registration_key` a Activo/Bloqueado.
- **AC-CFG-08** La lista de usuarios muestra en rojo a los bloqueados.
- **AC-CFG-09** Crear una plantilla sin texto muestra error local.
- **AC-CFG-10** En el compositor, el buscador de plantillas no consulta hasta escribir 2 caracteres.
- **AC-CFG-11** Guardar notificados de un grupo reemplaza `grupo_b` y refresca las listas/detalles.
- **AC-CFG-12** Un 422 del backend se muestra en los campos correspondientes del formulario.

---

## 9. Límites y deuda conocida

- No hay paginación en las listas de configuración; se cargan completas.
- No hay búsqueda server-side en grupos/suscriptores/usuarios desde la UI (solo plantillas).
- No hay validación de ciclos al mover/reasignar grupos (no existe edición de `pertenece`).
- La cascada de eliminación es una advertencia textual; el frontend no la calcula.
- `useAuthMembership*` existe pero no se usa en las vistas actuales; la edición de grupos de usuario usa `auth_groups` directamente.
- `GrupoCreate`/`SuscriptorCreate` usan `null` en campos tipados como `string` por `strict: false`.
- Los textos de error de algunos formularios están duplicados o son incorrectos (p. ej. “Error al crear el grupo” en alta de suscriptor).
- No hay tests.
