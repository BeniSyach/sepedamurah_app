import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { PengembalianResponse } from './types'

interface UsePengembalian {
  page?: number
  perPage?: number
  search?: string
}

export function useGetPengembalian(params: UsePengembalian) {
  return useQuery({
    queryKey: ['useGetPengembalian', params],
    queryFn: async () => {
      const { data } = await api.get<PengembalianResponse>('/pengembalian', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
