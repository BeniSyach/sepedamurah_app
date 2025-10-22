import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Program } from './types'

interface UpdateProgramPayload {
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  nm_program: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateProgramPayload): Promise<Program> => {
      const { data } = await api.put<Program>(
        `/master-data/program/${payload.kd_prog1}/${payload.kd_prog2}/${payload.kd_prog3}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefProgram'] })
    },
    onError: (err) => {
      return err
    },
  })
}
