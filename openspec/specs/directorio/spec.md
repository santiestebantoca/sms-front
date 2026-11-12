# directorio Specification

## Purpose

Definir el comportamiento actual del módulo Configurar / Directorio: gestión jerárquica de grupos, suscriptores, grupos notificados, usuarios de la aplicación, grupos de autenticación y plantillas de texto reutilizables. Esta spec describe el estado AS-IS del frontend; la autorización real la aplica el backend.

## Requirements

### Requirement: Jerarquía de grupos

El sistema SHALL exigir `nombre` en todo grupo y SHALL expresar la jerarquía mediante `pertenece`, que referencia el id del grupo padre. El árbol SHALL construirse en el frontend a partir de la lista plana del backend.

#### Scenario: Grupo raíz

- **WHEN** el usuario crea un grupo sin `pertenece`
- **THEN** el formulario solo exige `nombre`
- **AND** el grupo se muestra como raíz del árbol

#### Scenario: Subgrupo

- **WHEN** el usuario crea un subgrupo desde `/configurar/grupos/:grupoId/hijos/crear`
- **THEN** el payload incluye `pertenece` igual al id del grupo actual
- **AND** el nuevo grupo aparece como hijo en el árbol

#### Scenario: Construcción del árbol

- **WHEN** la vista de grupos recibe la lista plana de `GET /grupos/grupos`
- **THEN** `flatToTree(data, { parentKey: 'pertenece' })` construye la jerarquía
- **AND** un `pertenece` nulo o inexistente se trata como raíz

#### Scenario: Nombre obligatorio

- **WHEN** el usuario intenta guardar un grupo sin `nombre`
- **THEN** la validación local muestra "Este campo no puede estar vacío"
- **AND** no se llama al backend

#### Scenario: Padre no editable

- **WHEN** el usuario abre el formulario general de alta o edición de un grupo
- **THEN** el formulario no permite elegir `pertenece`
- **AND** el padre solo se fija mediante la ruta de creación de hijos

### Requirement: Etiquetas y filtros de grupos

El sistema SHALL usar `label` para identificar el rol de un grupo. Solo los grupos con `label === 'origen'` SHALL ser seleccionables como origen de SMS, y las consultas de notificables y orígenes SHALL filtrar por los valores `grupo,centro` y `centro,origen` respectivamente.

#### Scenario: Grupo origen

- **WHEN** un grupo tiene `label === 'origen'`
- **THEN** la UI lo marca con icono verde
- **AND** aparece como seleccionable en el modal de orígenes del compositor

#### Scenario: Grupo no origen

- **WHEN** un grupo no tiene `label === 'origen'`
- **THEN** la UI lo marca con icono amarillo
- **AND** no aparece como origen seleccionable

#### Scenario: Catálogo de grupos notificables

- **WHEN** la vista solicita grupos notificables
- **THEN** llama `GET /grupos/grupos?label=grupo,centro`

#### Scenario: Catálogo de grupos origen

- **WHEN** la vista solicita grupos origen
- **THEN** llama `GET /grupos/grupos?label=centro,origen`

### Requirement: Eliminación en cascada de grupos

El sistema SHALL advertir antes de eliminar un grupo que la acción elimina permanentemente el grupo, sus grupos hijos y los suscriptores de esos grupos. El frontend no SHALL calcular la cascada por sí mismo.

#### Scenario: Confirmación de eliminación

- **WHEN** el usuario abre el modal de eliminación de un grupo
- **THEN** la UI muestra la advertencia de cascada
- **AND** solo ejecuta `DELETE /grupos/grupos/{id}` si el usuario confirma

#### Scenario: Grupo eliminado

- **WHEN** el backend confirma la eliminación
- **THEN** la mutación invalida las listas de grupos
- **AND** la vista navega de vuelta a la lista

### Requirement: Detalle y navegación de grupos

El sistema SHALL mostrar en el detalle de un grupo las pestañas General, Grupos, Suscriptores y Notificados, con carga diferida en las tres últimas. La lista SHALL usar un árbol con indentación por nivel y estado activo.

#### Scenario: Pestañas del detalle

- **WHEN** el usuario abre `/configurar/grupos/:grupoId`
- **THEN** se muestra la pestaña General
- **AND** las pestañas Grupos, Suscriptores y Notificados se cargan solo al activarse

#### Scenario: Árbol de grupos

- **WHEN** la lista de grupos se renderiza
- **THEN** usa `RootTree` y `TreeNode`
- **AND** cada nivel se indenta según su profundidad
- **AND** se distingue el grupo activo y sus descendientes activos

### Requirement: Validación de suscriptores

El sistema SHALL exigir `nombre` y `telefono` en todo suscriptor. El teléfono SHALL cumplir `MOVIL_PATRON = /^(\+53|53)?\d{8}$/`; `correo` SHALL ser opcional y, si existe, cumplir `EMAIL_PATRON`; `activo` SHALL ser `true` por defecto.

#### Scenario: Teléfono inválido

- **WHEN** el usuario introduce un teléfono que no cumple `MOVIL_PATRON`
- **THEN** la validación local muestra "Formato no válido"
- **AND** no se envía la petición al backend

#### Scenario: Correo opcional

- **WHEN** el usuario crea un suscriptor sin `correo`
- **THEN** el formulario considera válido el alta
- **AND** si se introduce un correo, se valida contra `EMAIL_PATRON`

#### Scenario: Estado por defecto

- **WHEN** el usuario crea un suscriptor sin indicar `activo`
- **THEN** el valor enviado es `true`
- **AND** la lista lo muestra con icono verde

#### Scenario: Grupo obligatorio

- **WHEN** el usuario crea un suscriptor desde la vista global
- **THEN** `grupo` es obligatorio
- **WHEN** el alta se abre desde un grupo
- **THEN** `grupo` se precarga con el id del grupo y no se valida en el cliente

### Requirement: Suplente, estado y baja de suscriptores

El sistema SHALL permitir elegir un `suplente` opcional de la lista completa de suscriptores y SHALL conservar los registros históricos al eliminar un suscriptor, según la advertencia mostrada al usuario.

#### Scenario: Suplente opcional

- **WHEN** el usuario edita un suscriptor
- **THEN** puede dejar `suplente` vacío
- **AND** si lo selecciona, se envía el id del suscriptor suplente

#### Scenario: Eliminación de suscriptor

- **WHEN** el usuario confirma la eliminación de un suscriptor
- **THEN** se ejecuta `DELETE /suscriptores/suscriptores/{id}`
- **AND** la confirmación indica que los registros históricos se conservan

#### Scenario: Detalle de suscriptor

- **WHEN** el usuario abre el detalle de un suscriptor
- **THEN** se muestran `grupo`, `suplente`, `modified_by` y `modified_on`
- **AND** el formulario de edición usa `grupo_id` y `suplente_id` del detalle

### Requirement: Gestión de usuarios

El sistema SHALL exigir `first_name`, `last_name` y `username` en todo usuario, SHALL editar sus roles como un arreglo de ids de `auth_groups` y SHALL exponer `registration_key` únicamente en el formulario de edición.

#### Scenario: Alta de usuario

- **WHEN** el usuario crea un usuario
- **THEN** el formulario exige nombre, apellidos y username
- **AND** los grupos son opcionales
- **AND** el payload no incluye `registration_key`

#### Scenario: Edición de estado

- **WHEN** el usuario edita un usuario existente
- **THEN** puede cambiar `registration_key` entre `null` (Activo) y `'blocked'` (Bloqueado)
- **AND** los roles se editan con checkboxes de `auth_groups`

#### Scenario: Usuario bloqueado en lista

- **WHEN** un usuario tiene `registration_key === 'blocked'`
- **THEN** la lista lo muestra en rojo con el icono `UserX`

#### Scenario: Catálogo de roles

- **WHEN** la vista carga el catálogo `GET /auth_groups/auth_groups`
- **THEN** la query usa `staleTime: Infinity`
- **AND** no se refresca automáticamente durante la sesión

#### Scenario: Detalle de usuario

- **WHEN** el usuario abre el detalle de un usuario
- **THEN** se muestran nombre completo, username, roles, estado, `modified_by` y `modified_on`

### Requirement: Eliminación de usuarios

El sistema SHALL advertir que eliminar un usuario elimina también sus mensajes enviados y SHALL sugerir bloquear al usuario en lugar de eliminarlo.

#### Scenario: Confirmación de baja

- **WHEN** el usuario abre el modal de eliminación de un usuario
- **THEN** la UI advierte sobre la pérdida de mensajes enviados
- **AND** sugiere usar el bloqueo como alternativa
- **AND** solo ejecuta `DELETE /usuarios/usuarios/{id}` si el usuario confirma

### Requirement: Visibilidad de la sección Usuarios

El sistema SHALL mostrar la opción "Usuarios" en Configurar únicamente cuando `authUser.admin` sea verdadero. Esta restricción SHALL ser solo de navegación y no sustituye la autorización del backend.

#### Scenario: Administrador

- **WHEN** `authUser.admin` es verdadero
- **THEN** la navegación de Configurar incluye "Usuarios"

#### Scenario: No administrador

- **WHEN** `authUser.admin` es falso o ausente
- **THEN** la navegación no incluye "Usuarios"
- **AND** el backend sigue siendo responsable de denegar accesos directos

### Requirement: Plantillas de texto

El sistema SHALL exigir `texto` en toda plantilla, buscar plantillas en el servidor mediante `?search=` y consultar desde el compositor solo cuando la búsqueda tenga al menos 2 caracteres. Insertar una plantilla SHALL concatenar su texto al cuerpo actual.

#### Scenario: Plantilla sin texto

- **WHEN** el usuario intenta guardar una plantilla sin `texto`
- **THEN** la validación local muestra un error
- **AND** no se llama al backend

#### Scenario: Búsqueda server-side

- **WHEN** la vista de plantillas busca un término
- **THEN** la consulta se ejecuta en el servidor con `?search=`

#### Scenario: Umbral de búsqueda en el compositor

- **WHEN** el compositor busca un término de menos de 2 caracteres
- **THEN** no se ejecuta la consulta

#### Scenario: Insertar plantilla en el compositor

- **WHEN** el usuario selecciona una plantilla desde el compositor
- **THEN** el texto de la plantilla se concatena al cuerpo actual
- **AND** no se reemplaza el contenido existente

#### Scenario: Guardar plantilla desde el compositor

- **WHEN** el usuario guarda el texto actual como plantilla
- **THEN** se crea una plantilla nueva con ese texto
- **AND** la lista de plantillas se invalida

#### Scenario: Eliminar plantilla

- **WHEN** el usuario confirma la eliminación de una plantilla
- **THEN** se ejecuta `DELETE /plantillas/plantillas/{id}`
- **AND** la eliminación es permanente

### Requirement: Grupos notificados

El sistema SHALL representar los grupos notificados de un grupo como el arreglo `grupo_b` y SHALL reemplazar el conjunto completo al guardar. La consulta de notificados de un grupo SHALL usar `?origen={grupoId}`.

#### Scenario: Edición del conjunto

- **WHEN** el usuario guarda los notificados de un grupo
- **THEN** se envía `PUT /notificados/notificados/{grupoId}` con `{ grupo_b: [...] }`
- **AND** el arreglo reemplaza el conjunto anterior completo

#### Scenario: Selección de grupos

- **WHEN** el usuario abre el árbol de selección de notificados
- **THEN** se cargan los grupos con `GET /grupos/grupos?label=grupo,centro`
- **AND** puede marcar cualquier grupo del árbol

#### Scenario: Consulta por origen

- **WHEN** la vista necesita los notificados de un grupo
- **THEN** llama `GET /notificados/notificados?origen={grupoId}`

#### Scenario: Conjunto vacío

- **WHEN** el usuario guarda sin marcar ningún grupo
- **THEN** no hay validación local que impida el envío
- **AND** el backend recibe `grupo_b` vacío

### Requirement: Patrones de escritura, errores y navegación

El sistema SHALL invalidar las listas afectadas tras cada escritura y también los detalles en las actualizaciones, SHALL mostrar los errores `422` en el formulario y SHALL navegar al detalle del recurso creado usando el id devuelto.

#### Scenario: Invalidación tras creación o eliminación

- **WHEN** una mutación de creación o eliminación finaliza con éxito
- **THEN** se invalidan las listas correspondientes

#### Scenario: Invalidación tras actualización

- **WHEN** una mutación de actualización finaliza con éxito
- **THEN** se invalidan las listas y los detalles correspondientes

#### Scenario: Error de validación del backend

- **WHEN** el backend responde `422`
- **THEN** los errores se asignan al estado local del formulario
- **AND** se muestran en los campos mediante `errorState`
- **AND** no se emite un toast global duplicado

#### Scenario: Navegación tras crear

- **WHEN** una creación finaliza con éxito y el backend devuelve el recurso con `id`
- **THEN** la vista navega al detalle del nuevo recurso

#### Scenario: Modales como rutas

- **WHEN** el usuario cierra un modal de edición o eliminación
- **THEN** la navegación usa `back`
- **AND** tras eliminar, la navegación usa `forward` hacia la lista

#### Scenario: Sin actualizaciones optimistas

- **WHEN** el usuario ejecuta una escritura
- **THEN** la UI espera la respuesta del servidor
- **AND** solo después invalida la caché
- **AND** no se modifica el estado local de forma optimista
