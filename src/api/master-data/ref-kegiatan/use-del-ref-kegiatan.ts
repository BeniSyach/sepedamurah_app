import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteKegiatanPayload {
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRefKegiatan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_keg1,
      kd_keg2,
      kd_keg3,
      kd_keg4,
      kd_keg5,
    }: DeleteKegiatanPayload): Promise<void> => {
      await api.delete(
        `/master-data/kegiatan/${kd_keg1}/${kd_keg2}/${kd_keg3}/${kd_keg4}/${kd_keg5}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefKegiatan'] })
    },
    onError: (error) => {
      return error
    },
  })
}
