import { useQuery } from '@pinia/colada'
import { usuariosApi as api } from '@/api/usuarios'
import { queryKeys } from '@/lib/query-keys'
import { Ref, toValue } from 'vue'

export function useUsuarioQuery(usuarioId?: number | string | Ref) {

  const { data, isPending, isLoading } = useQuery({
    key: () => queryKeys.usuarios.detalle(toValue(usuarioId)),
    query: () => api.getById(toValue(usuarioId)),
    enabled: () => !!toValue(usuarioId),
    staleTime: Infinity
  })

  return {
    usuario: data,
    isPending,
    isLoading,
  }
}
