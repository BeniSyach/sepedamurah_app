import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

interface DeleteLaporaPajakBendahara {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLaporanPajakBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteLaporaPajakBendahara): Promise<void> => {
      await api.delete(`/laporan/laporan-pajak-bendahara/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanPajakBendahara'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
