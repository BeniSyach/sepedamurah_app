import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteBatasWaktuPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteBatasWaktu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteBatasWaktuPayload): Promise<void> => {
      await api.delete(`/hak-akses/batas-waktu/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetBatasWaktu'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
