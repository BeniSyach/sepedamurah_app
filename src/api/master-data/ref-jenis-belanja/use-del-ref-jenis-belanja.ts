import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteJenisBelanjaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRefJenisBelanja() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_ref1,
      kd_ref2,
      kd_ref3,
    }: DeleteJenisBelanjaPayload): Promise<void> => {
      await api.delete(
        `/master-data/jenis-belanja/${kd_ref1}/${kd_ref2}/${kd_ref3}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefJenisBelanja'] })
    },
    onError: (error) => {
      return error
    },
  })
}
