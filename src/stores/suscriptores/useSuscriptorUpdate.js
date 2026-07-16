import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { patch } from '@/utils'

//
// Queries: listas, detalle, detalle expandido del grupo que lo contiene (padre)
//
export function useSuscriptorUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: async ({ id, ...updatedData }) => {
      // Variables para sincronizar el detalle expandido del grupo que lo contiene
      const parentId = updatedData?.grupo

      // Claves que interesan
      const keyListas = queryKeys.suscriptores.listas()
      const keyDetalle = queryKeys.suscriptores.detalle(id)
      const keyGrupo = queryKeys.grupos.detalleExpandido(parentId)

      // Cancelar queries en curso
      await Promise.all([
        queryCache.cancelQueries({ key: keyListas }),
        queryCache.cancelQueries({ key: keyDetalle }),
        queryCache.cancelQueries({ key: keyGrupo })
      ])

      // Estado anterior
      const previousListas = queryCache.getQueryData(keyListas)
      const previousDetalle = queryCache.getQueryData(keyDetalle)
      const previousGrupo = queryCache.getQueryData(keyGrupo)

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
      console.log(updatedData)
      if (previousGrupo) {
        queryCache.setQueryData(
          keyGrupo,
          (old) => patch(old, updatedData, 'suscriptores')
        )
      }

      return {
        keyListas,
        keyDetalle,
        keyGrupo,
        previousListas,
        previousDetalle,
        previousGrupo,
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

      if (context.previousGrupo) {
        queryCache.setQueryData(
          context.keyGrupo,
          (old) => patch(old, data, 'suscriptores')
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

      if (context.previousGrupo) {
        queryCache.setQueryData(
          context.keyGrupo,
          context.previousGrupo
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