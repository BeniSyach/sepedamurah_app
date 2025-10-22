import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LogTTEResponse } from './types'

interface UseLogTTE {
  page?: number
  perPage?: number
  search?: string
}

export function useGetLogTTE(params: UseLogTTE) {
  return useQuery({
    queryKey: ['useGetLogTTE', params],
    queryFn: async () => {
      const { data } = await api.get<LogTTEResponse>('/history/log-tte', {
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
