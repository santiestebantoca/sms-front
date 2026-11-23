# mensajeria-sms Specification

## Purpose

Definir el comportamiento actual del módulo de mensajería SMS: composición de mensajes, selección de orígenes, derivación y ajuste de destinatarios, envío con o sin continuación, consulta de la colección por conversaciones y uso de plantillas de texto. Esta spec describe el estado AS-IS del frontend.

## Requirements

### Requirement: Validación previa al envío

El sistema SHALL bloquear el envío cuando la lista de destinatarios esté vacía o el cuerpo del mensaje esté vacío. El envío SHALL ejecutarse directamente, sin confirmación ni vista previa.

#### Scenario: Sin destinatarios

- **WHEN** el usuario intenta enviar sin destinatarios
- **THEN** la UI muestra "Seleccione al menos un destinatario"
- **AND** no se llama al backend

#### Scenario: Sin texto

- **WHEN** el usuario intenta enviar con el cuerpo vacío
- **THEN** la validación local bloquea el envío
- **AND** no se llama al backend

#### Scenario: Envío directo

- **WHEN** el usuario pulsa enviar con destinatarios y texto válidos
- **THEN** se ejecuta la mutación de envío sin diálogo de confirmación
- **AND** no se muestra una vista previa del mensaje

### Requirement: Estado de continuación

El sistema SHALL usar `continua` para indicar si la conversación queda pendiente. El compositor nuevo SHALL iniciar con `continua = true`; la continuación de un mensaje previo SHALL iniciar con `continua = false` y `previo = id`.

#### Scenario: Mensaje nuevo

- **WHEN** el usuario abre `/sms/componer`
- **THEN** el formulario inicia con `continua = true`
- **AND** el mensaje enviado queda como pendiente de continuar

#### Scenario: Continuación de conversación

- **WHEN** el usuario abre `/sms/continuar/:mensajePrevioId`
- **THEN** el formulario inicia con `continua = false`
- **AND** `previo` contiene el id del mensaje previo
- **AND** el mensaje enviado queda cerrado en el turno

### Requirement: Selección de orígenes

El sistema SHALL permitir seleccionar como origen únicamente grupos cuyo `label === 'origen'`, consultados mediante `GET /grupos/grupos?label=centro,origen`.

#### Scenario: Orígenes disponibles

- **WHEN** el usuario abre el modal de orígenes
- **THEN** se consultan los grupos con `label=centro,origen`
- **AND** solo los grupos con `label === 'origen'` son seleccionables

#### Scenario: Grupo sin etiqueta de origen

- **WHEN** un grupo devuelto no tiene `label === 'origen'`
- **THEN** la UI no permite seleccionarlo como origen

### Requirement: Derivación de destinatarios

El sistema SHALL precargar todos los suscriptores activos de todos los grupos notificados de los orígenes elegidos, usando `GET /notificados/notificados?origen=<ids>`. Marcar o desmarcar un grupo notificado SHALL agregar o quitar todos sus suscriptores activos sin duplicados.

#### Scenario: Carga inicial de destinatarios

- **WHEN** el usuario elige uno o más orígenes
- **THEN** se consultan sus grupos notificados
- **AND** se precargan todos los suscriptores activos de todos esos grupos
- **AND** la lista de destinatarios no contiene duplicados

#### Scenario: Marcar grupo notificado

- **WHEN** el usuario marca un grupo notificado
- **THEN** se agregan todos sus suscriptores activos a la lista de destinatarios
- **AND** los suscriptores ya presentes no se duplican

#### Scenario: Desmarcar grupo notificado

- **WHEN** el usuario desmarca un grupo notificado
- **THEN** se quitan de la lista todos los suscriptores de ese grupo
- **AND** los suscriptores agregados manualmente desde otros grupos se conservan

#### Scenario: Suscriptor inactivo en grupo notificado

- **WHEN** un grupo notificado contiene suscriptores con `activo = false`
- **THEN** `GET /notificados/notificados` no los incluye en `suscriptores`
- **AND** el compositor no los precarga como destinatarios
- **AND** el usuario no puede seleccionarlos desde la lista de notificados

### Requirement: Ajuste manual de destinatarios

El sistema SHALL permitir al usuario marcar y desmarcar suscriptores individuales después de la precarga automática.

#### Scenario: Refinamiento de la lista

- **WHEN** el usuario desmarca un suscriptor individual
- **THEN** ese suscriptor se excluye del envío
- **AND** el resto de la lista se mantiene

#### Scenario: Nueva precarga

- **WHEN** cambia la consulta de grupos notificados
- **THEN** el compositor reinicia la lista de destinatarios con la nueva precarga
- **AND** los ajustes manuales previos pueden descartarse

### Requirement: Colección y agrupación de conversaciones

El sistema SHALL consultar `GET /mensajes/mensajes` con los filtros `continua`, `desde`, `hasta` y `search`, y SHALL agrupar localmente los mensajes por `subgrupo` para mostrarlos como conversaciones.

#### Scenario: Agrupación por subgrupo

- **WHEN** la colección recibe la lista de mensajes
- **THEN** agrupa los mensajes por `subgrupo`
- **AND** cada grupo se muestra como una conversación
- **AND** el resumen indica la cantidad de mensajes y conversaciones

#### Scenario: Búsqueda en la colección

- **WHEN** el usuario escribe un término de búsqueda
- **THEN** la consulta se ejecuta en el servidor con `?search=`

#### Scenario: Filtro de pendientes

- **WHEN** la colección usa `continua = true`
- **THEN** muestra los mensajes pendientes por continuar

#### Scenario: Filtro de enviados en el turno

- **WHEN** la colección usa `continua = false`
- **THEN** muestra los mensajes enviados en el turno actual

### Requirement: Ventana de tiempo del turno

El sistema SHALL calcular la ventana de "enviados en este turno" desde las 08:00 del día actual hasta las 23:59:59. Si la hora actual es anterior a las 08:00, la ventana SHALL comenzar a las 08:00 del día anterior.

#### Scenario: Consulta después de las 08:00

- **WHEN** la hora actual es igual o posterior a las 08:00
- **THEN** `desde` es las 08:00 del día actual
- **AND** `hasta` es las 23:59:59 del día actual

#### Scenario: Consulta antes de las 08:00

- **WHEN** la hora actual es anterior a las 08:00
- **THEN** `desde` es las 08:00 del día anterior
- **AND** `hasta` es las 23:59:59 del día actual

### Requirement: Estado visual de las tarjetas de mensaje

El sistema SHALL indicar el estado de cada mensaje mediante el borde de la tarjeta: naranja si `continua` y el mensaje es de otro usuario, naranja rojizo si `continua` y es propio, y teal si no continúa.

#### Scenario: Mensaje pendiente de otro usuario

- **WHEN** un mensaje tiene `continua = true` y su autor no es el usuario actual
- **THEN** la tarjeta muestra borde naranja

#### Scenario: Mensaje pendiente propio

- **WHEN** un mensaje tiene `continua = true` y su autor es el usuario actual
- **THEN** la tarjeta muestra borde naranja rojizo

#### Scenario: Mensaje cerrado

- **WHEN** un mensaje tiene `continua = false`
- **THEN** la tarjeta muestra borde teal

### Requirement: Acción No continuar

El sistema SHALL permitir cerrar una conversación pendiente ejecutando `PUT /mensajes/mensajes/{id}` con `{ continua: false }`.

#### Scenario: Cerrar conversación

- **WHEN** el usuario pulsa "No continuar" en una tarjeta pendiente
- **THEN** se ejecuta `PUT /mensajes/mensajes/{id}` con `{ continua: false }`
- **AND** al completarse, el mensaje deja de aparecer en "Pendientes por continuar"

### Requirement: Plantillas en el compositor

El sistema SHALL buscar plantillas desde el compositor solo con 2 o más caracteres, SHALL concatenar el texto de una plantilla al cuerpo actual y SHALL permitir guardar el texto actual como plantilla nueva.

#### Scenario: Insertar plantilla

- **WHEN** el usuario selecciona una plantilla
- **THEN** su texto se concatena al final del cuerpo actual
- **AND** el contenido previo no se reemplaza

#### Scenario: Guardar plantilla

- **WHEN** el usuario guarda el texto actual como plantilla
- **THEN** se crea una plantilla con ese texto
- **AND** la lista de plantillas se invalida

#### Scenario: Búsqueda corta

- **WHEN** el usuario escribe menos de 2 caracteres en el buscador de plantillas
- **THEN** no se ejecuta la consulta

### Requirement: Badge de notificaciones

El sistema SHALL mostrar en la colección el contador `notificaciones.pendientes` y SHALL refrescar esa consulta con `staleTime: 60s`. Tras enviar un mensaje, SHALL invalidar la consulta de notificaciones.

#### Scenario: Contador visible

- **WHEN** `GET /notificaciones/notificaciones` devuelve `pendientes`
- **THEN** el badge de "Colección" muestra ese valor
- **AND** la query se refresca automáticamente cada 60 segundos

#### Scenario: Envío exitoso

- **WHEN** un mensaje se envía correctamente
- **THEN** se invalida la lista de notificaciones
- **AND** el badge se actualiza con el nuevo valor

### Requirement: Límites del cliente SMS

El sistema SHALL enviar el texto tal como lo escribe el usuario, sin límite de caracteres, segmentación ni validación de formato SMS en el cliente.

#### Scenario: Texto largo

- **WHEN** el usuario escribe un texto de cualquier longitud
- **THEN** el compositor no bloquea el envío por cantidad de caracteres
- **AND** no se calculan segmentos SMS
- **AND** el backend recibe el texto completo

### Requirement: Destinatarios de un mensaje

El sistema SHALL leer los destinatarios de un mensaje desde `GET /envios/envios?mensaje_id={id}` y SHALL normalizarlos a `{ id: suscriptor_id, nombre: suscriptor, grupo }`.

#### Scenario: Consulta de envíos

- **WHEN** el usuario abre la lista de destinatarios de un mensaje
- **THEN** se consulta `GET /envios/envios?mensaje_id={id}`
- **AND** cada envío se normaliza con `id`, `nombre` y `grupo`

#### Scenario: Mensaje sin envíos

- **WHEN** la consulta no devuelve envíos
- **THEN** la lista de destinatarios se muestra vacía
- **AND** no se produce un error de renderizado
