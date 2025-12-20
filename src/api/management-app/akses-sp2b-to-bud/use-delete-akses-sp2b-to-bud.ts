import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesSp2bToBUDPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteAksesSp2bToBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteAksesSp2bToBUDPayload): Promise<void> => {
      await api.delete(`/hak-akses/akses-sp2b-ke-bud/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesSp2bToBUD'],
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
