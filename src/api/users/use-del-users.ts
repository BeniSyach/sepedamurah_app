import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'

interface DeleteUsersPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteUsersPayload): Promise<void> => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
