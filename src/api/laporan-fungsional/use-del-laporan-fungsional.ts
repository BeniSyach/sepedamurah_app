import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'

interface DeleteLaporanFungsinalload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLaporanFungsional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteLaporanFungsinalload): Promise<void> => {
      await api.delete(`/laporan/fungsional/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanFungsional'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
