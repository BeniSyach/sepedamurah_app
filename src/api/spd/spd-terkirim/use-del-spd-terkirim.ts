import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteSPDTerkirimPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteSPDTerkirim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteSPDTerkirimPayload): Promise<void> => {
      await api.delete(`/spd/spd-terkirim/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetSPDTerkirim'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSPD'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
