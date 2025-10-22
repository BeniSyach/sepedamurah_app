import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Urusan } from './types'

interface UpdateUrusanPayload {
  kd_urusan: string
  nm_urusan: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefUrusan() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateUrusanPayload): Promise<Urusan> => {
      const { data } = await api.put<Urusan>(
        `/master-data/urusan/${payload.kd_urusan}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefUrusan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
