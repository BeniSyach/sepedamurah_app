import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BidangUrusan } from './types'

interface UpdateBidangUrusanPayload {
  kd_bu1: string
  kd_bu2: string
  nm_bu: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefBidangUrusan() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateBidangUrusanPayload
    ): Promise<BidangUrusan> => {
      const { data } = await api.put<BidangUrusan>(
        `/master-data/bidang-urusan/${payload.kd_bu1}/${payload.kd_bu2}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefBidangUrusan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
