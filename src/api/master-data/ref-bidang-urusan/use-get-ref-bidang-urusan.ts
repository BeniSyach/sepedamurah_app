import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BidangUrusanResponse } from './types'

interface UseRefBidangUrusan {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefBidangUrusan(params: UseRefBidangUrusan) {
  return useQuery({
    queryKey: ['useGetRefBidangUrusan', params],
    queryFn: async () => {
      const { data } = await api.get<BidangUrusanResponse>(
        '/master-data/bidang-urusan',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
