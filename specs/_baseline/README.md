# Specs Base — Estado actual (AS-IS) · Referencia histórica

> **No es la fuente de verdad.** La fuente de verdad del comportamiento está en
> `openspec/specs/<capability>/spec.md` y los cambios se gestionan en `openspec/changes/`.
>
> Esta carpeta conserva el snapshot AS-IS detallado (rutas, endpoints, contratos y deuda
> conocida) que sirvió para inicializar OpenSpec. Úsala como contexto histórico; si el
> código y estos documentos discrepan, gana el código actual.

## Índice de módulos

| Spec | Módulo | Alcance |
|---|---|---|
| [`01-auth-sesion.md`](./01-auth-sesion.md) | Autenticación y sesión | Login, logout, guard de rutas, expiración por inactividad, personificación |
| [`02-configuracion-directorio.md`](./02-configuracion-directorio.md) | Configuración / directorio | Grupos, suscriptores, usuarios, grupos de autenticación, notificados, plantillas |
| [`03-mensajeria-sms.md`](./03-mensajeria-sms.md) | Mensajería SMS | Componer, continuar conversación, colección, orígenes, destinatarios, envío |

## Cómo leer una spec base

Cada archivo contiene:

1. **Propósito** — qué resuelve el módulo.
2. **Actores y permisos** — quién puede hacer qué (según UI y contratos observados).
3. **Componentes, rutas y endpoints** — mapa exacto de implementación.
4. **Reglas de negocio actuales** — numeradas (`R-*`) y verificables.
5. **Contratos de datos** — campos usados por el frontend.
6. **Criterios de aceptación AS-IS** — comportamiento que hoy se considera correcto.
7. **Límites y deuda conocida** — lo que el módulo **no** garantiza.

## Invariantes globales

Aplican a todos los módulos:

- **G-01** Toda llamada HTTP pasa por `src/api/client/client.ts` (Axios, `withCredentials`, `X-Requested-With`, timeout 120 s).
- **G-02** Los módulos de `src/api/*` devuelven `response.data`, no la respuesta completa.
- **G-03** Las queries usan claves de `src/lib/query-keys.ts`; las mutaciones invalidan `listas()` y, si aplica, `detalles()`.
- **G-04** Un 401 fuera del intento de login emite `unauthorized` y redirige a `auth-login` con `next`.
- **G-05** Los errores 422 se muestran en el formulario; el resto se muestra globalmente vía toast.
- **G-06** Las rutas protegidas declaran `meta.requiresAuth`; login/logout/expired declaran `meta.logout`.
- **G-07** Los IDs se tratan como `number | string`.
- **G-08** La UI está en español y no usa i18n.
- **G-09** Las acciones destructivas se confirman en un modal de ruta (`.../eliminar`) y no son reversibles.
- **G-10** El frontend no implementa autorización real; solo oculta opciones. El backend es la autoridad.

## Protocolo de cambio

1. No modificar una spec base para “describir lo que queremos”. Las specs base son históricas.
2. Todo cambio funcional se crea con OpenSpec en `openspec/changes/<change-id>/` y usa delta:
   - `## ADDED Requirements`
   - `## MODIFIED Requirements` (citando el ID base, p. ej. `R-GRP-03`)
   - `## REMOVED Requirements`
3. Al archivar o sincronizar el cambio, se actualiza `openspec/specs/<capability>/spec.md`.
4. Si el código y la spec discrepan, **gana el código actual** hasta que se apruebe un cambio; documentar la discrepancia.

## Fuera de alcance de la baseline

- Backend, base de datos, esquema, migraciones y reglas del servidor.
- Infraestructura, despliegue, proxy y certificados.
- Accesibilidad, rendimiento y seguridad más allá de lo observable en el frontend.
- Tests (no existen en el repositorio).
