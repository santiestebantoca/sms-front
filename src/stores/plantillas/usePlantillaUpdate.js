import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { plantillasApi as api } from '@/api/plantillas'
import { patch, remove, satisfies } from '@/utils'

//
// Queries: lista (filtrada), detalle
//
export function usePlantillaUpdate(filtroLista) {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: async ({ id, ...updatedData }) => {
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

      // Actualización optimista
      if (previousLista) {
        queryCache.setQueryData(
          keyLista,
          (old) => patch(old, updatedData)
        )
        if (!satisfies(updatedData, filtroLista)) {
          queryCache.setQueryData(
            keyLista,
            (old) => remove(old, id)
          )
        }
      }

      if (previousDetalle) {
        queryCache.setQueryData(
          keyDetalle,
          (old) => patch(old, updatedData)
        )
      }

      return {
        keyLista,
        filtroLista,
        keyDetalle,
        previousLista,
        previousDetalle,
      }
    },

    onSuccess: (data, variables, context) => {
      if (context.previousLista) {
        queryCache.setQueryData(
          context.keyLista,
          (old) => patch(old, data)
        )
        if (!satisfies(data, context.filtroLista)) {
          queryCache.setQueryData(
            context.keyLista,
            (old) => remove(old, data.id)
          )
        }
      }

      if (context.previousDetalle) {
        queryCache.setQueryData(
          context.keyDetalle,
          (old) => patch(old, data)
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