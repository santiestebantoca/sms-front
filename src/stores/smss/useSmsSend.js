import { useMutation } from '@pinia/colada'
import { smssApi as api } from '@/api/smss'

export function useSmsSend() {
  return useMutation({
    mutation: (newData) => api.send(newData),
  })
}