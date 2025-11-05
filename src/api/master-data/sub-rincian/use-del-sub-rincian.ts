import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

/**
 * Hook untuk menghapus data urusan (DELETE)
 */
export function useDeleteRefSubRincian() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima kd_urusan yang ingin dihapus
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/master-data/sub-rincian/${id}`)
    },
    onSuccess: () => {
      // Refresh data urusan setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetSubRincian'] })
    },
    onError: (err) => {
      return err
    },
  })
}
