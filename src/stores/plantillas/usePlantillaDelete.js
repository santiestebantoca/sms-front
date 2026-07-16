import { useMutation, useQueryCache } from '@pinia/colada'
import { plantillasApi as api } from '@/api/plantillas'
import { queryKeys } from '@/lib/query-keys'
import { patch, remove, satisfies } from '@/utils'

//
// Queries: lista (filtrada), detalle
//
export function usePlantillaDelete(filtroLista) {
  const queryCache = useQueryCache()

  return useMutation({
    // Recibe el data completo
    mutation: (deletedData) => api.delete(deletedData.id),

    onMutate: async (deletedData) => {
      const { id } = deletedData

      // Claves que interesan
      const keyLista = queryKeys.plantillas.lista(filtroLista)
      const keyDetalle = queryKeys.plantillas.detalle(id)

      // Cancelar queries en curso
      await Promise.all([
        queryCache.cancelQueries({ key: keyLista }),
        queryCache.cancelQueries({ key: keyDetalle }),
      ])

      // Estado anterior
      const previousLista = queryCache.getQueryData(keyLista)
      const previousDetalle = queryCache.getQueryData(keyDetalle)

      // Marcar como "eliminando"
      if (previousLista) {
        queryCache.setQueryData(
          keyLista,
          (old) => patch(old, { id, _deleting: true })
        )
      }

      if (previousDetalle) {
        queryCache.setQueryData(
          keyDetalle,
          (old) => patch(old, { _deleting: true })
        )
      }

      return {
        keyLista,
        keyDetalle,
        previousLista,
        previousDetalle,
        deletedId: id
      }
    },

    onSuccess: async (data, variables, context) => {
      if (context.previousLista) {
        queryCache.setQueryData(
          context.keyLista,
          (old) => remove(old, context.deletedId)
        )
      }
    },

    onError: (error, variables, context) => {
      if (context.previousLista) {
        queryCache.setQueryData(
          context.keyLista,
          context.previousLista
        )
      }

      if (context.previousDetalle) {
        queryCache.setQueryData(
          context.keyDetalle,
          context.previousDetalle
        )
      }
    }
  })
}