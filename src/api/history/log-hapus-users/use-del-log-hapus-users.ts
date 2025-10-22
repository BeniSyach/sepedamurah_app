import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteLogHapusUsersPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLogHapusUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteLogHapusUsersPayload): Promise<void> => {
      await api.delete(`/history/log-users-hapus/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLogHapusUsers'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
