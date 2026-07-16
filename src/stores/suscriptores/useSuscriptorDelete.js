import { useMutation, useQueryCache } from '@pinia/colada'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { queryKeys } from '@/lib/query-keys'
import { patch, remove } from '@/utils'

//
// Queries: listas, detalle y detalle del grupo expandido que lo contiene
//
export function useSuscriptorDelete() {
  const queryCache = useQueryCache()

  return useMutation({
    // Recibe el suscriptor completo
    mutation: (suscriptorEliminado) => api.delete(suscriptorEliminado.id),

    onMutate: async (suscriptorEliminado) => {
      const { id, grupo: grupoId } = suscriptorEliminado

      // Claves que interesan
      const keyListas = queryKeys.suscriptores.listas()
      const keyDetalle = queryKeys.suscriptores.detalle(id)
      const keyGrupo = queryKeys.grupos.detalleExpandido(grupoId)

      // Cancelar queries en curso
      await Promise.all([
        queryCache.cancelQueries({ key: keyListas }),
        queryCache.cancelQueries({ key: keyDetalle }),
        queryCache.cancelQueries({ key: keyGrupo }),
      ])

      // Estado anterior
      const previousListas = queryCache.getQueryData(keyListas)
      const previousDetalle = queryCache.getQueryData(keyDetalle)
      const previousGrupo = queryCache.getQueryData(keyGrupo)

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

      if (previousGrupo) {
        queryCache.setQueryData(
          keyGrupo,
          (old) => patch(old, { id, _deleting: true }, 'suscriptores')
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
        grupoId
      }
    },

    onSuccess: async (data, variables, context) => {
      if (context.previousListas) {
        queryCache.setQueryData(
          context.keyListas,
          (old) => remove(old, context.id)
        )
      }

      if (context.previousGrupo) {
        queryCache.setQueryData(
          context.keyGrupo,
          (old) => remove(old, context.id, 'suscriptores')
        )
      }

      // Limpiar cualquier caché residual
      // const suscriptorEliminadoQueryEntry = queryCache.get(queryKeys.suscriptores.detalle(id))
      // if (suscriptorEliminadoQueryEntry) queryCache.remove(suscriptorEliminadoQueryEntry)
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
    }
  })
}