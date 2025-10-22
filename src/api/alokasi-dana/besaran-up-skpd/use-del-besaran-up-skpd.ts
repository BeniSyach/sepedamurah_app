import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteUPSKPDPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  tahun: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteUPSKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_opd1,
      kd_opd2,
      kd_opd3,
      kd_opd4,
      kd_opd5,
      tahun,
    }: DeleteUPSKPDPayload): Promise<void> => {
      await api.delete(
        `/alokasi-dana/up-skpd/${kd_opd1}/${kd_opd2}/${kd_opd3}/${kd_opd4}/${kd_opd5}/${tahun}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetUPSKPD'] })
    },
    onError: (error) => {
      return error
    },
  })
}
