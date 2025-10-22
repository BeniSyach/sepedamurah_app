import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteAksesKuasaBUDPayload {
  id: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteAksesKuasaBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: DeleteAksesKuasaBUDPayload): Promise<void> => {
      await api.delete(`/hak-akses/akses-kuasa-bud/${id}`)
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesKuasaBUD'],
      })
    },
    onError: (error) => {
      return error
    },
  })
}
