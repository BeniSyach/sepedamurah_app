import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeletePermohonanSP2DPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeletePermohonanSP2D() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeletePermohonanSP2DPayload): Promise<void> => {
      await api.delete(`/sp2d/permohonan-sp2d/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSP2D'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
