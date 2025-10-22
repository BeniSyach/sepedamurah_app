import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteSubKegiatanPayload {
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRefSubKegiatan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_subkeg1,
      kd_subkeg2,
      kd_subkeg3,
      kd_subkeg4,
      kd_subkeg5,
      kd_subkeg6,
    }: DeleteSubKegiatanPayload): Promise<void> => {
      await api.delete(
        `/master-data/sub-kegiatan/${kd_subkeg1}/${kd_subkeg2}/${kd_subkeg3}/${kd_subkeg4}/${kd_subkeg5}/${kd_subkeg6}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefSubKegiatan'] })
    },
    onError: (error) => {
      return error
    },
  })
}
