import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

/**
 * Hook untuk menghapus data urusan (DELETE)
 */
export function useDeleteRefLevelRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima kd_urusan yang ingin dihapus
    mutationFn: async (kode: string): Promise<void> => {
      await api.delete(`/master-data/level-rekening/${kode}`)
    },
    onSuccess: () => {
      // Refresh data urusan setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetLevelRekening'] })
    },
    onError: (err) => {
      return err
    },
  })
}
