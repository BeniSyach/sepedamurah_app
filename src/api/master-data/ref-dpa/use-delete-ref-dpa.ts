import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

/**
 * Hook untuk menghapus data urusan (DELETE)
 */
export function useDeleteRefDPA() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima kd_urusan yang ingin dihapus
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/master-data/ref-dpa/${id}`)
    },
    onSuccess: () => {
      // Refresh data urusan setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefDPA'] })
    },
    onError: (err) => {
      return err
    },
  })
}
