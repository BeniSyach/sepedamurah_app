import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteRealisasiTransferSumberDanaPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRealisasiTransferSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
    }: DeleteRealisasiTransferSumberDanaPayload): Promise<void> => {
      await api.delete(`/alokasi-dana/realisasi-transfer-sumber-dana/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetRealisasiTransferSumberDana'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetRekapRealisasiTransferSumberDana'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
