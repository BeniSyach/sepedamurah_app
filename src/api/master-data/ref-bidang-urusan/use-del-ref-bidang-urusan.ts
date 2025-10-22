import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteBidangUrusanPayload {
  kd_bu1: string
  kd_bu2: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRefBidangUrusan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_bu1,
      kd_bu2,
    }: DeleteBidangUrusanPayload): Promise<void> => {
      await api.delete(`/master-data/bidang-urusan/${kd_bu1}/${kd_bu2}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefBidangUrusan'] })
    },
    onError: (error) => {
      return error
    },
  })
}
