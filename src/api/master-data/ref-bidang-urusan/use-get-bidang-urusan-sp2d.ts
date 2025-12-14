import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BidangUrusanResponse } from './types'

interface UseRefBidangUrusanSp2d {
  page?: number
  perPage?: number
  kd_urusan?: string
  role?: string
}

export function useGetRefBidangUrusanSp2d(params: UseRefBidangUrusanSp2d) {
  return useQuery({
    queryKey: ['useGetRefBidangUrusanSp2d', params],
    enabled: !!params.kd_urusan, // ✅ langsung di sini aja
    queryFn: async () => {
      const { data } = await api.get<BidangUrusanResponse>(
        '/master-data/bidang-urusan-by-pagu-belanja',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            kd_urusan: params.kd_urusan ?? '',
            role: params.role,
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
