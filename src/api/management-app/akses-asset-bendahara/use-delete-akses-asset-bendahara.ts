import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesAssetBendaharaPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteAksesAssetBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
    }: DeleteAksesAssetBendaharaPayload): Promise<void> => {
      await api.delete(`/hak-akses/akses-asset-bendahara/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesAssetBendahara'],
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
