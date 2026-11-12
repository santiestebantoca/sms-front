# Spec Base — Mensajería SMS

| Campo | Valor |
|---|---|
| Módulo | `mensaje` |
| Estado | AS-IS (comportamiento actual) |
| Rutas | `/sms/**` |
| Archivos clave | `src/views/mensaje/**`, `src/components/features/mensaje/**`, `src/stores/mensajes/**`, `src/stores/notificados/**`, `src/stores/envios/**`, `src/stores/notificaciones/**`, `src/api/mensajes.ts`, `src/api/envios.ts`, `src/api/notificados.ts`, `src/api/notificaciones.ts` |

---

## 1. Propósito

Permitir a un usuario autenticado:

- Componer un SMS eligiendo **orígenes** (grupos etiquetados como `origen`).
- Derivar los **destinatarios** a partir de los **grupos notificados** de esos orígenes.
- Ajustar manualmente los destinatarios.
- Enviar el mensaje con o sin **continuación**.
- Consultar la **colección** de mensajes, agrupados por conversación.
- **Continuar** una conversación previa reutilizando su texto y destinatarios.
- Guardar/insertar **plantillas** de texto.

---

## 2. Rutas

| Path | Name | Comportamiento |
|---|---|---|
| `/sms` | `sms` | Layout del módulo; `requiresAuth`. |
| `/sms` (index) | `sms-home` | Accesos a Componer y Colección. |
| `/sms/componer` | `sms-componer` | Compositor nuevo. |
| `/sms/componer/origenes` | `sms-componer-origenes` | Modal de selección de orígenes. |
| `/sms/continuar/:mensajePrevioId` | `sms-continuar` | Compositor precargado desde un mensaje previo. |
| `/sms/coleccion` | `sms-coleccion` | Bandeja/colección de mensajes. |

---

## 3. Componentes y stores

### 3.1 Vistas

| Archivo | Responsabilidad |
|---|---|
| `views/mensaje/index.vue` | Layout + drawer de navegación del módulo. |
| `views/mensaje/home.vue` | Enlaces a Componer/Colección. |
| `views/mensaje/componer/index.vue` | Compositor nuevo. |
| `views/mensaje/componer/origenes.vue` | Selección de orígenes (solo `label === 'origen'`). |
| `views/mensaje/continuar/index.vue` | Compositor de continuación. |
| `views/mensaje/coleccion.vue` | Lista/filtros de mensajes. |

### 3.2 Componentes

| Archivo | Responsabilidad |
|---|---|
| `components/features/mensaje/componer/ComposerTopBar.vue` | Barra superior: enviar, “Para”, continuación, plantillas. |
| `ListaPlantillas.vue` | Widget de búsqueda/inserción de plantillas. |
| `seleccionar-desde-origenes/SeleccionarDesdeOrigenes.vue` | Orígenes + notificados + destinatarios. |
| `seleccionar-desde-origenes/ListaNotificados.vue` | Árbol grupos notificados → suscriptores. |
| `seleccionar-desde-origenes/ListaDestinatarios.vue` | Lista plana de destinatarios. |
| `components/features/mensaje/ListaDestinatarios.vue` | Modal de destinatarios de un mensaje (`envios`). |
| `components/features/mensaje/coleccion/MensajeCard.vue` | Tarjeta de mensaje + acciones. |

### 3.3 Stores

| Archivo | Responsabilidad |
|---|---|
| `stores/mensajes/useMensajeSend.ts` | `POST /mensajes/mensajes`; invalida notificaciones. |
| `stores/mensajes/useMensajesQuery.ts` | Lista filtrada + agrupación por `subgrupo`; `useMensajesFilter`. |
| `stores/mensajes/useMensajeQuery.ts` | Detalle de mensaje. |
| `stores/mensajes/useMensajeUpdate.ts` | `PUT /mensajes/mensajes/{id}` (p. ej. `continua: false`). |
| `stores/notificados/useNotificadosQuery.ts` | Notificados por origen/grupo. |
| `stores/envios/useEnviosQuery.ts` | Destinatarios de un mensaje (`?mensaje_id=`). |
| `stores/notificaciones/useNotificacionesQuery.ts` | Contador `pendientes` para el badge. |
| `stores/plantillas/*` | Búsqueda/creación/eliminación de plantillas. |

### 3.4 Endpoints

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/mensajes/mensajes` | Lista; params `continua`, `desde`, `hasta`, `search`. |
| `POST` | `/mensajes/mensajes` | Enviar mensaje. |
| `GET` | `/mensajes/mensajes/{id}` | Detalle (mensaje previo). |
| `PUT` | `/mensajes/mensajes/{id}` | Actualizar (`continua`). |
| `GET` | `/mensajes/notificaciones` | Endpoint declarado en `mensajesApi`; sin uso actual en vistas. |
| `GET` | `/notificados/notificados` | Notificados por `origen`. |
| `GET` | `/envios/envios` | Destinatarios por `mensaje_id`. |
| `GET` | `/notificaciones/notificaciones` | `pendientes` para badge. |
| `GET/POST/PUT/DELETE` | `/plantillas/plantillas[/{id}]` | Plantillas. |

---

## 4. Flujo de composición

### 4.1 Componer mensaje nuevo

```text
/sms/componer
  form = { destinatarios: [], texto: null, continua: true }
  ├─ Botón "Orígenes (grupo#origen)" → modal /sms/componer/origenes
  │    └─ GET /grupos/grupos?label=centro,origen
  │         └─ solo grupos con label === 'origen' son seleccionables
  ├─ Al elegir orígenes:
  │    ├─ GET /notificados/notificados?origen=<ids>
  │    ├─ Se listan grupos notificados y sus suscriptores
  │    └─ Se precargan TODOS los suscriptores de TODOS los grupos notificados
  ├─ El usuario puede marcar/desmarcar grupos notificados o suscriptores
  ├─ Plantillas: buscar (>=2 caracteres), insertar (concatena) o guardar texto
  └─ Enviar → POST /mensajes/mensajes
       payload = { destinatarios, texto, continua, previo? }
```

### 4.2 Continuar conversación

```text
/sms/continuar/:mensajePrevioId
  ├─ GET /mensajes/mensajes/{id}  → precarga texto
  ├─ GET /envios/envios?mensaje_id={id} → precarga destinatarios
  ├─ form.continua = false
  ├─ form.previo = mensajePrevio.id
  └─ Enviar → POST /mensajes/mensajes
```

### 4.3 Colección

```text
/sms/coleccion
  ├─ continua = true por defecto → "Pendientes por continuar"
  ├─ Si continua = false → "Enviados en este turno"
  │    └─ rango: desde 08:00 de hoy (o ayer si ahora < 08:00) hasta 23:59:59
  ├─ GET /mensajes/mensajes?continua=&desde=&hasta=&search=
  └─ Agrupación local por `subgrupo` → conversaciones
```

---

## 5. Reglas de negocio actuales

| ID | Regla |
|---|---|
| `R-SMS-01` | La lista de destinatarios no puede estar vacía para enviar. |
| `R-SMS-02` | El cuerpo del mensaje no puede estar vacío para enviar. |
| `R-SMS-03` | `continua = true` marca el mensaje como “con continuación” (conversación pendiente). |
| `R-SMS-04` | `continua = false` marca el mensaje como cerrado/enviado en el turno. |
| `R-SMS-05` | El compositor nuevo inicia con `continua = true`; la continuación inicia con `continua = false` y `previo = id`. |
| `R-SMS-06` | Solo los grupos con `label === 'origen'` pueden seleccionarse como origen. |
| `R-SMS-07` | Los destinatarios iniciales son **todos** los suscriptores de **todos** los grupos notificados de los orígenes elegidos. |
| `R-SMS-08` | Marcar/desmarcar un grupo notificado agrega/quita **todos** sus suscriptores de la lista de destinatarios, sin duplicados. |
| `R-SMS-09` | El usuario puede refinar manualmente la lista de destinatarios (marcar/desmarcar suscriptores). |
| `R-SMS-10` | Si no hay destinatarios, la UI muestra “Seleccione al menos un destinatario” y el envío se bloquea por validación local. |
| `R-SMS-11` | La colección agrupa mensajes por `subgrupo`; cada grupo es una conversación. |
| `R-SMS-12` | “Pendientes por continuar” filtra `continua = true`; “Enviados en este turno” filtra `continua = false` con ventana de fechas. |
| `R-SMS-13` | La ventana de “enviados en este turno” empieza a las 08:00 del día actual; si la hora actual es anterior a las 08:00, empieza a las 08:00 del día anterior y termina a las 23:59:59 de hoy. |
| `R-SMS-14` | La búsqueda de la colección es server-side (`?search=`). |
| `R-SMS-15` | “No continuar” en una tarjeta ejecuta `PUT /mensajes/mensajes/{id}` con `{ continua: false }`. |
| `R-SMS-16` | El borde de la tarjeta indica estado: naranja si `continua` y el mensaje es de otro usuario; naranja rojizo si `continua` y es propio; teal si no continúa. |
| `R-SMS-17` | Insertar una plantilla **concatena** el texto al cuerpo actual. |
| `R-SMS-18` | Guardar plantilla desde el compositor crea una plantilla con el texto actual. |
| `R-SMS-19` | El badge de “Colección” usa `notificaciones.pendientes`; la query se auto-refresca con `staleTime: 60s`. |
| `R-SMS-20` | Tras enviar, se invalida la lista de notificaciones (badge), no la lista de mensajes. |
| `R-SMS-21` | No hay confirmación previa al envío; el botón de enviar ejecuta la mutación directamente. |
| `R-SMS-22` | No hay límite de caracteres, segmentación ni validación de formato SMS en el cliente. |
| `R-SMS-23` | Los destinatarios de un mensaje se leen de `envios` y se normalizan a `{ id: suscriptor_id, nombre: suscriptor, grupo }`. |

---

## 6. Contratos de datos usados por el frontend

### 6.1 Payload de envío

```ts
interface MensajePayload {
  destinatarios: (number | string)[]
  texto: string
  continua: boolean
  previo?: number | string
}
```

### 6.2 Mensaje (campos consumidos)

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `number \| string` | Detalle/continuar/actualizar. |
| `texto` | `string` | Cuerpo y copia. |
| `continua` | `boolean` | Estado de conversación. |
| `subgrupo` | `string \| number` | Agrupación en conversaciones. |
| `de` | `string` | Autor; comparación con `authUser.name`. |
| `en` | `string` | Fecha; formateada con `shortTime`. |
| `previo` | `number \| string` | Referencia al mensaje previo. |

### 6.3 Notificados (respuesta usada)

```ts
interface GrupoNotificado {
  id: number | string
  nombre?: string
  apodo?: string
  suscriptores?: Array<{
    id: number | string
    nombre?: string
    telefono?: string
    grupo?: number | string // presencia => es suscriptor, no grupo
  }>
}
```

> `ListaNotificados` distingue grupo vs suscriptor por la presencia de `data.grupo`.

### 6.4 Envíos (respuesta usada)

```ts
interface Envio {
  suscriptor_id: number | string
  suscriptor: string
  grupo: string
}
```

### 6.5 Notificaciones

```ts
interface NotificacionesResumen {
  pendientes: number
  // otros campos no usados por el frontend actual
}
```

---

## 7. Criterios de aceptación AS-IS

- **AC-SMS-01** Enviar sin destinatarios muestra un aviso y no llama al backend.
- **AC-SMS-02** Enviar sin texto muestra un aviso y no llama al backend.
- **AC-SMS-03** Elegir un origen carga sus grupos notificados y precarga todos sus suscriptores.
- **AC-SMS-04** Desmarcar un grupo notificado quita sus suscriptores de la lista; volver a marcarlo los agrega sin duplicados.
- **AC-SMS-05** Un mensaje enviado con `continua = true` aparece en “Pendientes por continuar”.
- **AC-SMS-06** “No continuar” actualiza el mensaje y lo saca de pendientes.
- **AC-SMS-07** Continuar una conversación precarga texto y destinatarios del mensaje previo.
- **AC-SMS-08** La colección agrupa por `subgrupo` y muestra “N mensajes en M conversaciones”.
- **AC-SMS-09** Insertar una plantilla agrega su texto al final del cuerpo.
- **AC-SMS-10** El widget de plantillas no busca hasta tener 2 caracteres.
- **AC-SMS-11** El badge de colección refleja `notificaciones.pendientes`.

---

## 8. Límites y deuda conocida

- No hay paginación ni scroll infinito en la colección.
- No hay confirmación de envío ni vista previa del mensaje.
- No hay conteo de caracteres/segmentos SMS.
- `useMensajeSend` no invalida `queryKeys.mensajes.listas()`; la colección depende de `refresh` manual o auto-refetch.
- `SeleccionarDesdeOrigenes` reinicia `destinatarios` cuando cambia `notificados` (`watchEffect`), lo que puede descartar ajustes manuales si la query se refresca.
- `ListaDestinatarios.vue` (global) crea `useEnviosQuery()` sin id y asigna `mensajeId` en `@show`; la primera apertura puede quedar sin datos.
- `ListaNotificados` asume que un suscriptor tiene `grupo` y un grupo no; es un contrato implícito.
- El estado `continua` se interpreta como “conversación pendiente”, no como “reenvío”; confirmar semántica con negocio antes de cambiarla.
- No hay tests.
