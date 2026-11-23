# Spec Delta

## MODIFIED Requirements

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
