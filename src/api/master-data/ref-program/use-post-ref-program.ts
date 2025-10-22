import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Program } from './types'

interface CreateProgramPayload {
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  nm_program: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateProgramPayload): Promise<Program> => {
      const { data } = await api.post<Program>('/master-data/program', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefProgram'] })
    },
    onError: (err) => {
      return err
    },
  })
}
