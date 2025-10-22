import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'

interface DeletePengembalianload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeletePengembalian() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeletePengembalianload): Promise<void> => {
      await api.delete(`/pengembalian/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetPengembalian'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
