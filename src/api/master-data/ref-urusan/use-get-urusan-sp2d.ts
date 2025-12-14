import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UrusanResponse } from './types'

interface UseRefUrusansp2d {
  page?: number
  perPage?: number
  search?: string
  role?: string
}

export function useGetRefUrusanSp2d(params: UseRefUrusansp2d) {
  return useQuery({
    queryKey: ['useGetRefUrusanSp2d', params],
    queryFn: async () => {
      const { data } = await api.get<UrusanResponse>(
        '/master-data/urusan-by-pagu-belanja',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            role: params.role,
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
