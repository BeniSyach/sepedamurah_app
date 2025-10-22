import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteSKPDPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRefSKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_opd1,
      kd_opd2,
      kd_opd3,
      kd_opd4,
      kd_opd5,
    }: DeleteSKPDPayload): Promise<void> => {
      await api.delete(
        `/master-data/master-skpd/${kd_opd1}/${kd_opd2}/${kd_opd3}/${kd_opd4}/${kd_opd5}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefSKPD'] })
    },
    onError: (error) => {
      return error
    },
  })
}
