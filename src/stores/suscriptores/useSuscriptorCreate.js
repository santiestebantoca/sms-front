import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { push, replace } from '@/utils'

//
// Queries: listas y detalle expandido del grupo que lo contiene
//
export function useSuscriptorCreate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (nuevoSuscriptor) => api.create(nuevoSuscriptor),

    onMutate: async (nuevoSuscriptor) => {
      const grupoId = nuevoSuscriptor.grupo

      // Claves que interesan
      const keyListas = queryKeys.suscriptores.listas()
      const keyGrupo = queryKeys.grupos.detalleExpandido(grupoId)

      // Cancelar queries en curso
      await Promise.all([
        queryCache.cancelQueries({ key: keyListas }),
        queryCache.cancelQueries({ key: keyGrupo }),
      ])

      // Estado anterior
      const previousListas = queryCache.getQueryData(keyListas)
      const previousGrupo = queryCache.getQueryData(keyGrupo)

      // Actualización optimista
      const tempId = Date.now()
      const optimisticSuscriptor = { ...nuevoSuscriptor, id: tempId }

      if (previousListas) {
        queryCache.setQueryData(
          keyListas,
          (old) => push(old, optimisticSuscriptor)
        )
      }

      if (previousGrupo) {
        queryCache.setQueryData(
          keyGrupo,
          (old) => push(old, optimisticSuscriptor, 'suscriptores')
        )
      }

      return {
        keyListas,
        keyGrupo,
        previousListas,
        previousGrupo,
        tempId,
        grupoId
      }
    },

    onSuccess: (data, variables, context) => {
      if (context.previousListas) {
        queryCache.setQueryData(
          context.keyListas,
          (old) => replace(old, context.tempId, data)
        )
      }

      if (context.previousGrupo) {
        queryCache.setQueryData(
          context.keyGrupo,
          (old) => replace(old, context.tempId, data, 'suscriptores')
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

      if (context.previousGrupo) {
        queryCache.setQueryData(
          context.keyGrupo,
          context.previousGrupo
        )
      }
    }
  })
}