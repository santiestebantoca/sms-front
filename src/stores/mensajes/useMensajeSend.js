import { useMutation } from '@pinia/colada'
import { mensajesApi as api } from '@/api/mensajes'

export function useMensajeSend() {
  return useMutation({
    mutation: (newData) => api.send(newData),
  })
}