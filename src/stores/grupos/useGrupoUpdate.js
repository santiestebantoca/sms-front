import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'
import { patch } from '@/utils'

//
// Queries: listas, detalle, detalle expandido, detalle expandido del grupo que lo contiene (padre)
//
export function useGrupoUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: async ({ id, ...updatedData }) => {
      // Variables para sincronizar el detalle expandido del grupo que lo contiene
      const parentId = updatedData?.pertenece

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

      // Actualización optimista
      if (previousListas) {
        queryCache.setQueryData(
          keyListas,
          (old) => patch(old, updatedData)
        )
      }

      if (previousDetalle) {
        queryCache.setQueryData(
          keyDetalle,
          (old) => patch(old, updatedData)
        )
      }

      if (previousDetalleExpandido) {
        queryCache.setQueryData(
          keyDetalleExpandido,
          (old) => patch(old, updatedData)
        )
      }

      if (previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          keyPadreDetalleExpandido,
          (old) => patch(old, updatedData, 'hijos')
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

    onSuccess: (data, variables, context) => {
      if (context.previousListas) {
        queryCache.setQueryData(
          context.keyListas,
          (old) => patch(old, data)
        )
      }

      if (context.previousDetalle) {
        queryCache.setQueryData(
          context.keyDetalle,
          (old) => patch(old, data)
        )
      }

      if (context.previousDetalleExpandido) {
        queryCache.setQueryData(
          context.keyDetalleExpandido,
          (old) => patch(old, data)
        )
      }

      if (context.previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          context.keyPadreDetalleExpandido,
          (old) => patch(old, data, 'hijos')
        )
      }
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
          context.previousPadreDetalleExpandido
        )
      }
    }
  })
}