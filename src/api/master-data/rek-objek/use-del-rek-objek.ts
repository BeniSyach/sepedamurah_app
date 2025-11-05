import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

/**
 * Hook untuk menghapus data urusan (DELETE)
 */
export function useDeleteRefRekObjek() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima kd_urusan yang ingin dihapus
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/master-data/rek-objek/${id}`)
    },
    onSuccess: () => {
      // Refresh data urusan setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRekObjek'] })
    },
    onError: (err) => {
      return err
    },
  })
}
