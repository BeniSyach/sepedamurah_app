import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesDPASKPDPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteAksesDPASKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteAksesDPASKPDPayload): Promise<void> => {
      await api.delete(`/hak-akses/akses-dpa-skpd/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesDPASKPD'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
