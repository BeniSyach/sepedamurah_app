import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeletePaguSumberDanaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeletePaguSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_ref1,
      kd_ref2,
      kd_ref3,
      kd_ref4,
      kd_ref5,
      kd_ref6,
    }: DeletePaguSumberDanaPayload): Promise<void> => {
      await api.delete(
        `/alokasi-dana/pagu-sumber-dana/${kd_ref1}/${kd_ref2}/${kd_ref3}/${kd_ref4}/${kd_ref5}/${kd_ref6}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetPaguSumberDana'] })
    },
    onError: (error) => {
      return error
    },
  })
}
