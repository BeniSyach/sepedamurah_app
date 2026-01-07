import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesDPASKPDPayload {
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
export function useDeleteAksesDPASKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd1,
      kd2,
      kd3,
      kd4,
      kd5,
      tahun,
    }: DeleteAksesDPASKPDPayload): Promise<void> => {
      await api.delete(
        `/hak-akses/akses-dpa-skpd/${kd1}/${kd2}/${kd3}/${kd4}/${kd5}/${tahun}`
      )
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesDPASKPD'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useCekLaporanDPA'],
      })
    },

    onError: (error) => {
      throw error
    },
  })
}
