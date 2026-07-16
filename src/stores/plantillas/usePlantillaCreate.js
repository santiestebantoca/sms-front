import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { plantillasApi as api } from '@/api/plantillas'
import { unshift, satisfies, replace } from '@/utils'

//
// Queries: lista (filtrada)
//
export function usePlantillaCreate(filtroLista) {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (newData) => api.create(newData),

    onMutate: async (newData) => {
      // Claves que interesan
      const keyLista = queryKeys.plantillas.lista(filtroLista)

      // Cancelar queries en curso
      await queryCache.cancelQueries({ key: keyLista })

      // Estado anterior
      const previousLista = queryCache.getQueryData(keyLista)

      // Actualización optimista
      const optimisticData = { ...newData, id: new Date() }
      if (previousLista && satisfies(newData, filtroLista)) {
        queryCache.setQueryData(
          keyLista,
          (old) => unshift(old, optimisticData)
        )
      }

      return {
        keyLista,
        filtroLista,
        previousLista,
        optimisticId: optimisticData.id
      }
    },

    onSuccess: async (data, variables, context) => {
      if (context.previousLista) {
        queryCache.setQueryData(
          context.keyLista,
          (old) => replace(old, context.optimisticId, data)
        )
        if (!satisfies(data, context.filtroLista)) {
          queryCache.setQueryData(
            context.keyLista,
            (old) => remove(old, data.id)
          )
        }
      }
    },

    onError: (error, variables, context) => {
      if (context.previousLista) {
        queryCache.setQueryData(
          context.keyLista,
          context.previousLista
        )
      }
    },
  })
}