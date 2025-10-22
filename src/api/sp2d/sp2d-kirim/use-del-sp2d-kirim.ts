import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteSP2DKirimPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteSP2DKirim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteSP2DKirimPayload): Promise<void> => {
      await api.delete(`/sp2d/sp2d-kirim/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetSP2DKirim'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
