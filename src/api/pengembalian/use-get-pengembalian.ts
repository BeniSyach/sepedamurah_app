import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { PengembalianResponse } from './types'

interface UsePengembalian {
  page?: number
  perPage?: number
  search?: string
  date_from?: string | undefined
  date_to?: string | undefined
  sort_by?: string | undefined
  sort_dir?: string | undefined
  status?: string | undefined
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
          date_from: params.date_from ?? '',
          date_to: params.date_to ?? '',
          sort_by: params.sort_by ?? '',
          sort_dir: params.sort_dir ?? '',
          status: params.status ?? '',
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
