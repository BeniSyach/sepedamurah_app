import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'

export function useDeleteSkpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await api.delete<{ success: boolean; message: string }>(`/skpp/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetSkpp'] })
    },
  })
}
