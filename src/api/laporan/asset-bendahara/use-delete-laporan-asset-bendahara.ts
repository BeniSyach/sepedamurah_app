import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

interface DeleteLaporaAssetBendahara {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLaporanAssetBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteLaporaAssetBendahara): Promise<void> => {
      await api.delete(`/laporan/laporan-asset-bendahara/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanAssetBendahara'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
