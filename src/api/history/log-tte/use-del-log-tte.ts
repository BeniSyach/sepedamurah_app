import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteLogTTEPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLogTTE() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteLogTTEPayload): Promise<void> => {
      await api.delete(`/history/log-tte/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLogTTE'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
