# Tasks

## 1. Formularios globales de suscriptor

- [x] 1.1 Añadir `:unchecked-value="false"` al checkbox `activo` de `src/views/configurar/suscriptores/crear.vue` y verificar que desmarcarlo deja `form.activo === false`.
- [x] 1.2 Añadir `:unchecked-value="false"` al checkbox `activo` de `src/views/configurar/suscriptores/[id]/editar.vue` y verificar que el payload del `PUT` contiene `activo: false` tras desmarcarlo.

## 2. Edición desde grupo

- [x] 2.1 Incluir `activo` en el formulario y en la carga del detalle de `src/views/configurar/grupos/[id]/suscriptores/[id]/editar.vue`, y mostrar el checkbox con `:unchecked-value="false"`.

## 3. Backend de notificados

- [x] 3.1 Añadir la condición `db.suscriptor.activo == True` a la consulta anidada de suscriptores en `D:\proyectos\web2py\applications\sms\controllers\notificados.py` y verificar que un grupo con un suscriptor inactivo devuelve solo los activos.
- [x] 3.2 Reiniciar el servicio web2py y comprobar manualmente que el compositor no precarga suscriptores inactivos.

## 4. Verificación

- [x] 4.1 Ejecutar `npm run typecheck` y confirmar que termina sin errores.
- [x] 4.2 Ejecutar `npm run build_sms` y confirmar que el build finaliza correctamente.

## Workflow follow-up

- Archivar el cambio con `openspec archive "arreglar-activo-suscriptor" -y` cuando la revisión esté aprobada.
- Verificar que `openspec/specs/directorio/spec.md` y `openspec/specs/mensajeria-sms/spec.md` reflejan el nuevo comportamiento.
