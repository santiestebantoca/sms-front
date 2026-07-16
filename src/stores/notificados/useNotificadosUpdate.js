import { useMutation, useQueryCache } from '@pinia/colada'
import { queryKeys } from '@/lib/query-keys'
import { notificadosApi as api } from '@/api/notificados'
import { patch } from '@/utils'

//
// Queries: detalle expandido del grupo que lo contiene
//
export function useNotificadosUpdate() {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, ...updatedData }) => api.update(id, updatedData),

    onMutate: async ({ id, ...updatedData }) => {
      // Claves que interesan
      const keyDetalleExpandido = queryKeys.grupos.detalleExpandido(id)
      const keyListaNotificables = queryKeys.grupos.listaNotificables()

      // Cancelar queries en curso
      await Promise.all([
        queryCache.cancelQueries({ key: keyDetalleExpandido }),
      ])

      // Estado anterior
      const previousGrupo = queryCache.getQueryData(keyDetalleExpandido)

      // Actualización optimista
      const gruposNotificables = queryCache.getQueryData(keyListaNotificables)
      const notificados = gruposNotificables.filter(grupo => updatedData.grupo_b.includes(grupo.id))

      if (previousGrupo) {
        queryCache.setQueryData(
          keyDetalleExpandido,
          (old) => patch(old, { notificados })
        )
      }

      return {
        keyDetalleExpandido,
        previousGrupo,
        id
      }
    },

    onSuccess: (data, variables, context) => {
      // Actualizar versión expandida con datos reales
      // No es necesario
    },

    onError: (error, variables, context) => {
      if (context.previousGrupo) {
        queryCache.setQueryData(
          context.keyDetalleExpandido,
          context.previousGrupo
        )
      }
    }
  })
}