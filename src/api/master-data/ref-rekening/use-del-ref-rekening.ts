import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteRekeningPayload {
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRefRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_rekening1,
      kd_rekening2,
      kd_rekening3,
      kd_rekening4,
      kd_rekening5,
      kd_rekening6,
    }: DeleteRekeningPayload): Promise<void> => {
      await api.delete(
        `/master-data/rekening/${kd_rekening1}/${kd_rekening2}/${kd_rekening3}/${kd_rekening4}/${kd_rekening5}/${kd_rekening6}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefRekening'] })
    },
    onError: (error) => {
      return error
    },
  })
}
