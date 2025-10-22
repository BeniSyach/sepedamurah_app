import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'

interface DeleteProgramPayload {
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
}

/**
 * Hook untuk menghapus data Bidang Urusan (DELETE)
 */
export function useDeleteRefProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      kd_prog1,
      kd_prog2,
      kd_prog3,
    }: DeleteProgramPayload): Promise<void> => {
      await api.delete(
        `/master-data/program/${kd_prog1}/${kd_prog2}/${kd_prog3}`
      )
    },
    onSuccess: () => {
      // Refresh data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ['useGetRefProgram'] })
    },
    onError: (error) => {
      return error
    },
  })
}
