import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'

interface DeleteDatRekeningPayload {
  kd_rek1: string
  kd_rek2: string
  kd_rek3: string
  kd_rek4: string
  kd_rek5: string
  kd_rek6: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteDatRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_rek1,
      kd_rek2,
      kd_rek3,
      kd_rek4,
      kd_rek5,
      kd_rek6,
    }: DeleteDatRekeningPayload): Promise<void> => {
      await api.delete(
        `/dat-rekening/${kd_rek1}/${kd_rek2}/${kd_rek3}/${kd_rek4}/${kd_rek5}/${kd_rek6}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetDatRekening'] })
    },
    onError: (error) => {
      return error
    },
  })
}
