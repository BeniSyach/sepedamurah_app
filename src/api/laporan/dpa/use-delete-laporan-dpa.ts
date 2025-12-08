import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'

interface DeleteLaporaDPA {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteLaporanDPA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteLaporaDPA): Promise<void> => {
      await api.delete(`/laporan/laporan-dpa/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanDPA'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
