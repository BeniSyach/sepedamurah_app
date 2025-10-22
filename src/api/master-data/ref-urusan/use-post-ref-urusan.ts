import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Urusan } from './types'

interface CreateUrusanPayload {
  kd_urusan: string
  nm_urusan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefUrusan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUrusanPayload): Promise<Urusan> => {
      const { data } = await api.post<Urusan>('/master-data/urusan', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefUrusan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
