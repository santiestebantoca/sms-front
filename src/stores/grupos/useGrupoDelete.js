import { useMutation, useQueryCache } from '@pinia/colada'
import { gruposApi as api } from '@/api/grupos'
import { queryKeys } from '@/lib/query-keys'
import { patch, remove } from '@/utils'

//
// Queries: listas, detalle, detalle expandido, detalle expandido del grupo que lo contiene (padre)
//
export function useGrupoDelete() {
  const queryCache = useQueryCache()

  return useMutation({
    // Recibe el grupo completo (raíz o hijo)
    mutation: (grupoEliminado) => api.delete(grupoEliminado.id),

    onMutate: async (grupoEliminado) => {
      // Variables para sincronizar el detalle expandido del grupo que lo contiene
      const { id, pertenece: parentId } = grupoEliminado

      // Claves que interesan
      const keyListas = queryKeys.grupos.listas()
      const keyDetalle = queryKeys.grupos.detalle(id)
      const keyDetalleExpandido = queryKeys.grupos.detalleExpandido(id)
      const keyPadreDetalleExpandido = queryKeys.grupos.detalleExpandido(parentId)

      // Cancelar queries en curso
      await Promise.all([
        queryCache.cancelQueries({ key: keyListas }),
        queryCache.cancelQueries({ key: keyDetalle }),
        queryCache.cancelQueries({ key: keyDetalleExpandido }),
        queryCache.cancelQueries({ key: keyPadreDetalleExpandido })
      ])

      // Estado anterior
      const previousListas = queryCache.getQueryData(keyListas)
      const previousDetalle = queryCache.getQueryData(keyDetalle)
      const previousDetalleExpandido = queryCache.getQueryData(keyDetalleExpandido)
      const previousPadreDetalleExpandido = queryCache.getQueryData(keyPadreDetalleExpandido)

      // Marcar como "eliminando"
      if (previousListas) {
        queryCache.setQueryData(
          keyListas,
          (old) => patch(old, { id, _deleting: true })
        )
      }

      if (previousDetalle) {
        queryCache.setQueryData(
          keyDetalle,
          (old) => patch(old, { _deleting: true })
        )
      }

      if (previousDetalleExpandido) {
        queryCache.setQueryData(
          keyDetalleExpandido,
          (old) => patch(old, { _deleting: true })
        )
      }

      if (previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          keyPadreDetalleExpandido,
          (old) => patch(old, { id, _deleting: true }, 'hijos')
        )
      }

      return {
        keyListas,
        keyDetalle,
        keyDetalleExpandido,
        keyPadreDetalleExpandido,
        previousListas,
        previousDetalle,
        previousDetalleExpandido,
        previousPadreDetalleExpandido,
        id,
        parentId,
      }
    },

    onSuccess: async (data, variables, context) => {
      // Refetch completo de la lista (no sabemos qué más se eliminó)
      const gruposQueryEntry = queryCache.get(context.keyListas)
      if (gruposQueryEntry) await queryCache.fetch(gruposQueryEntry)

      if (context.previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          context.keyPadreDetalleExpandido,
          (old) => remove(old, context.id, 'hijos')
        )
      }

      // Limpiar cualquier caché residual
      // const grupoEliminadoQueryEntry = queryCache.get(queryKeys.grupos.detalle(id))
      // if (grupoEliminadoQueryEntry) queryCache.remove(grupoEliminadoQueryEntry)
    },

    onError: (error, variables, context) => {
      if (context.previousListas) {
        queryCache.setQueryData(
          context.keyListas,
          context.previousListas
        )
      }

      if (context.previousDetalle) {
        queryCache.setQueryData(
          context.keyDetalle,
          context.previousDetalle
        )
      }

      if (context.previousDetalleExpandido) {
        queryCache.setQueryData(
          context.keyDetalleExpandido,
          context.previousDetalleExpandido
        )
      }

      if (context.previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          context.keyPadreDetalleExpandido,
          (old) => context.previousPadreDetalleExpandido
        )
      }
    }
  })
}