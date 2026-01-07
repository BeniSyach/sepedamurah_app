import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesAssetBendaharaPayload {
  kd1: string
  kd2: string
  kd3: string
  kd4: string
  kd5: string
  tahun: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteAksesAssetBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd1,
      kd2,
      kd3,
      kd4,
      kd5,
      tahun,
    }: DeleteAksesAssetBendaharaPayload): Promise<void> => {
      await api.delete(
        `/hak-akses/akses-asset-bendahara/${kd1}/${kd2}/${kd3}/${kd4}/${kd5}/${tahun}`
      )
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
