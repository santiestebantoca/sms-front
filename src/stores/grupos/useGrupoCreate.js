import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { gruposApi as api } from '@/api/grupos'
import { push, replace } from '@/utils'

//
// Queries: listas, detalle, detalle expandido, detalle expandido del grupo que lo contiene (padre)
//
export function useGrupoCreate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (nuevoGrupo) => api.create(nuevoGrupo),

    onMutate: async (nuevoGrupo) => {
      // Variables para sincronizar el detalle expandido del grupo que lo contiene
      const { pertenece: parentId } = nuevoGrupo

      // Claves que interesan
      const keyListas = queryKeys.grupos.listas()
      const keyPadreDetalleExpandido = queryKeys.grupos.detalleExpandido(parentId)

      // Cancelar queries en curso
      await Promise.all([
        queryCache.cancelQueries({ key: keyListas }),
        queryCache.cancelQueries({ key: keyPadreDetalleExpandido })
      ])

      // Estado anterior
      const previousListas = queryCache.getQueryData(keyListas)
      const previousPadreDetalleExpandido = queryCache.getQueryData(keyPadreDetalleExpandido)

      // Actualización optimista
      const tempId = Date.now()
      const optimisticGrupo = { ...nuevoGrupo, id: tempId }

      if (previousListas) {
        queryCache.setQueryData(
          keyListas,
          (old) => push(old, optimisticGrupo)
        )
      }

      if (previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          keyPadreDetalleExpandido,
          (old) => push(old, optimisticGrupo, 'hijos')
        )
      }

      return {
        keyListas,
        keyPadreDetalleExpandido,
        previousListas,
        previousPadreDetalleExpandido,
        tempId,
        parentId
      }
    },

    onSuccess: (data, variables, context) => {
      if (context.previousListas) {
        queryCache.setQueryData(
          context.keyListas,
          (old) => replace(old, context.tempId, data)
        )
      }

      if (context.previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          context.keyPadreDetalleExpandido,
          (old) => replace(old, context.tempId, data, 'hijos')
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

      if (context.previousPadreDetalleExpandido) {
        queryCache.setQueryData(
          context.keyPadreDetalleExpandido,
          context.previousPadreDetalleExpandido
        )
      }
    }
  })
}