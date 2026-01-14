import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

interface DeleteLaporaRekonsiliasiGajiSKPD {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLaporanRekonsiliasiGajiSKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
    }: DeleteLaporaRekonsiliasiGajiSKPD): Promise<void> => {
      await api.delete(`/laporan/laporan-rekonsiliasi-gaji-skpd/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanRekonsiliasiGajiSKPD'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
