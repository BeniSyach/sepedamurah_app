import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

interface DeleteLaporaSp2bToBUD {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLaporanSp2bToBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteLaporaSp2bToBUD): Promise<void> => {
      await api.delete(`/laporan/laporan-sp2b-to-bud/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanSp2bToBUD'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
