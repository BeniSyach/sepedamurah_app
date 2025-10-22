import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeletePermohonanSPDPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeletePermohonanSPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeletePermohonanSPDPayload): Promise<void> => {
      await api.delete(`/spd/permohonan-spd/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSPD'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
