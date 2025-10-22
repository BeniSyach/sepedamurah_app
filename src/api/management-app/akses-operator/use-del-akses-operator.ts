import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesOperatorPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteAksesOperator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteAksesOperatorPayload): Promise<void> => {
      await api.delete(`/hak-akses/akses-operator/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesOperator'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
