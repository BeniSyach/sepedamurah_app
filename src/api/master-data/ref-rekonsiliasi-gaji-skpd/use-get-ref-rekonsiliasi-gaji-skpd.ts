import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefRekonsiliasiGajiSkpdPaginatedResponse } from './types'

interface UseRefRekonsiliasiGajiSkpd {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefRekonsiliasiGajiSkpd(
  params: UseRefRekonsiliasiGajiSkpd
) {
  return useQuery({
    queryKey: ['useGetRefRekonsiliasiGajiSkpd', params],
    queryFn: async () => {
      const { data } = await api.get<RefRekonsiliasiGajiSkpdPaginatedResponse>(
        '/master-data/ref-rekonsiliasi-gaji-skpd',
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
