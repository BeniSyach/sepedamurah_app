import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteUserRolePayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteUserRolePayload): Promise<void> => {
      await api.delete(`/hak-akses/users-role/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetUserRole'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
