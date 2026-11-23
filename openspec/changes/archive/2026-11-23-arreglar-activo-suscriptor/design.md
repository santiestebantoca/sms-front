# Design

## Context

Ver `proposal.md` para la motivación. Puntos técnicos relevantes:

- `BFormCheckbox` de BootstrapVueNext define `uncheckedValue` con valor por defecto `undefined`. Vue aplica ese valor a `false-value`, de modo que al desmarcar un checkbox con `v-model` booleano el modelo pasa a `undefined`. Axios serializa el payload con `JSON.stringify`, que omite las propiedades `undefined`.
- El `PUT /suscriptores/suscriptores/{id}` del backend usa `validate_and_update(**vars)`, es decir, solo actualiza los campos presentes. Si `activo` se omite, el valor anterior se conserva.
- El formulario global de edición inicializa `form.activo` desde el detalle; el formulario anidado desde grupo no tiene el campo.
- `GET /notificados/notificados` consulta `db.suscriptor` por `grupo` sin condición de estado; el compositor agrega todos los `suscriptores` recibidos.

## Goals / Non-Goals

**Goals:**

- Garantizar que `activo` siempre viaje como booleano (`true`/`false`) en altas y ediciones.
- Permitir cambiar `activo` desde la edición de suscriptor de la vista de grupo.
- Excluir suscriptores inactivos de la respuesta de `/notificados/notificados`.

**Non-Goals:**

- Cambiar el formulario de alta desde grupo.
- Invalidar ni filtrar destinatarios históricos de `envios`.
- Introducir un control visual nuevo de estado en el compositor.

## Decisions

1. **Usar `:unchecked-value="false"` en los `BFormCheckbox` de `activo`.**
   - Motivo: corrige la causa raíz sin tocar la mutación ni el contrato del backend.
   - Alternativas descartadas: normalizar el payload en `useSuscriptorUpdate` (oculta el problema y afecta a cualquier campo opcional); usar un `computed` con getter/setter (más código para el mismo resultado).
2. **Añadir `activo` al formulario anidado de edición desde grupo.**
   - Se inicializa en el `watchEffect` que ya copia el detalle, usando `:unchecked-value="false"`.
   - No se añaden `grupo` ni `suplente` en esta vista para mantener el cambio acotado.
3. **Filtrar por `activo` en el backend, no en el frontend.**
   - Motivo: la exclusión forma parte del contrato de `/notificados/notificados`; filtrar en el frontend dejaría datos innecesarios en la respuesta y duplicaría la regla.
   - Se aplica en `controllers/notificados.py`, en la consulta anidada de suscriptores por grupo: `(db.suscriptor.grupo == r["id"]) & (db.suscriptor.activo == True)`.
   - Alternativa descartada: filtrar en `SeleccionarDesdeOrigenes.vue` (no corrige el contrato y depende de que cada consumidor lo replique).

## Risks / Trade-offs

- **El backend está fuera de este repositorio y de su build** → el cambio se aplica en `D:\proyectos\web2py\applications\sms`; debe desplegarse junto con el frontend y verificarse manualmente contra la instancia real.
- **Los suscriptores inactivos dejan de poder recibir SMS desde el compositor** → comportamiento confirmado por negocio; el flujo de continuación sigue mostrando los destinatarios históricos.
- **Registros con `activo` nulo en datos legados** → la condición `== True` los excluye; es coherente con la UI, que ya los muestra como inactivos.
- **Caché de `notificados`** → la query usa la clave `queryKeys.notificados.lista({ origen })`; tras desplegar el backend, la respuesta se refresca al consultar de nuevo o al invalidar, sin cambios de código de caché.

## Migration Plan

1. Aplicar el cambio del controlador y reiniciar el servicio web2py.
2. Desplegar el frontend.
3. Verificar con un suscriptor inactivo: no aparece en el compositor y sí aparece (en rojo) en el directorio.
4. Rollback: revertir la condición de `activo` en el controlador y/o el atributo `unchecked-value` de los checkboxes.
