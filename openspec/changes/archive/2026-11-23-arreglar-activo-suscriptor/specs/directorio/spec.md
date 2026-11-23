# Spec Delta

## ADDED Requirements

### Requirement: Edición del estado activo del suscriptor

El sistema SHALL enviar `activo` como booleano en toda alta o edición de suscriptor y SHALL exponerlo en el formulario global y en el de edición desde un grupo. Desmarcar el control SHALL enviar `false`; el campo no SHALL omitirse del payload. (R-SUS-05)

#### Scenario: Alta con estado inactivo

- **WHEN** el usuario desmarca "Activo" en el alta global y guarda
- **THEN** el payload incluye `activo = false`
- **AND** la lista muestra al suscriptor con el icono de inactivo

#### Scenario: Edición global a inactivo

- **WHEN** el usuario desmarca "Activo" en la edición global y guarda
- **THEN** el `PUT /suscriptores/suscriptores/{id}` incluye `activo = false`
- **AND** el detalle muestra "No" en el campo Activo

#### Scenario: Preservar el estado al editar otros campos

- **WHEN** el usuario abre la edición de un suscriptor y no modifica "Activo"
- **THEN** el payload conserva el valor recibido en el detalle, ya sea `true` o `false`

#### Scenario: Edición desde un grupo

- **WHEN** el usuario abre `/configurar/grupos/:grupoId/suscriptores/:suscriptorId/editar`
- **THEN** el formulario muestra "Activo" inicializado con el valor del detalle
- **AND** al guardar, el payload incluye el valor seleccionado
