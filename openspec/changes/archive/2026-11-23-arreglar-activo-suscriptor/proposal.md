# Proposal

## Why

El campo `activo` de los suscriptores no se actualiza de forma fiable: al desmarcar el checkbox en los formularios de alta y edición, BootstrapVueNext entrega `undefined` en lugar de `false`, y Axios omite esa propiedad del JSON. El backend recibe una actualización sin `activo` y conserva el valor anterior. Además, la edición de un suscriptor desde la vista de un grupo ni siquiera expone el campo.

Por otro lado, `GET /notificados/notificados` devuelve también a los suscriptores inactivos, por lo que el compositor los precarga como destinatarios. Se requiere que los inactivos no se incluyan en la derivación de destinatarios desde grupos notificados.

## What Changes

- Corregir el checkbox `activo` en los formularios globales de crear y editar suscriptor para que el valor desmarcado sea `false` y siempre viaje en el payload.
- Añadir el campo `activo` al formulario de edición de suscriptor desde la vista de grupo, inicializándolo desde el detalle y enviándolo en el `PUT`.
- **BREAKING** El backend (`GET /notificados/notificados`) dejará de devolver suscriptores con `activo = false` dentro de `suscriptores`, de modo que el compositor SMS no los precargue como destinatarios.
- Actualizar las specs de `directorio` y `mensajeria-sms` para reflejar el nuevo comportamiento observable.

**Fuera de alcance:**

- No se modifica el formulario de alta desde grupo (sigue sin exponer `activo`; el backend aplica su valor por defecto).
- No se altera el flujo de continuación (`/envios/envios`) ni los destinatarios históricos de un mensaje.
- No se añade un indicador visual de "inactivo" en el compositor ni en la vista de suscriptores del grupo.
- No se modifica el repositorio backend como parte del build de este proyecto; el cambio se aplica en `D:\proyectos\web2py\applications\sms` como dependencia externa documentada.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `directorio`: se precisa el comportamiento de edición de `activo` en los formularios global y anidado, y que el valor desmarcado se envíe como `false`.
- `mensajeria-sms`: la derivación de destinatarios solo debe incluir suscriptores activos de los grupos notificados.

## Impact

- `src/views/configurar/suscriptores/crear.vue`
- `src/views/configurar/suscriptores/[id]/editar.vue`
- `src/views/configurar/grupos/[id]/suscriptores/[id]/editar.vue`
- `D:\proyectos\web2py\applications\sms\controllers\notificados.py` (backend externo, fuera del build de este repo)
- Sin cambios en dependencias, `package.json`, rutas, stores ni contratos de tipos.
