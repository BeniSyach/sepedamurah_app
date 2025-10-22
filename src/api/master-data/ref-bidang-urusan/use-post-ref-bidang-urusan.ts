import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BidangUrusan } from './types'

interface CreateBidangUrusanPayload {
  kd_bu1: string
  kd_bu2: string
  nm_bu: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefBidangUrusan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateBidangUrusanPayload
    ): Promise<BidangUrusan> => {
      const { data } = await api.post<BidangUrusan>(
        '/master-data/bidang-urusan',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefBidangUrusan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
