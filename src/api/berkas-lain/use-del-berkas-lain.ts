import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'

interface DeleteBerkasLainload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteBerkasLain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteBerkasLainload): Promise<void> => {
      await api.delete(`/berkas-lain/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetBerkasLain'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
