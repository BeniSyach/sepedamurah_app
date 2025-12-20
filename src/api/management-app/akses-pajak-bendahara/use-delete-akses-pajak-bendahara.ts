import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesPajakBendaharaPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteAksesPajakBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
    }: DeleteAksesPajakBendaharaPayload): Promise<void> => {
      await api.delete(`/hak-akses/akses-pajak-bendahara/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesPajakBendahara'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useCekLaporanDPA'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
