import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PersetujuanResponse } from './types'

interface UseRefPersetujuan {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefPersetujuan(params: UseRefPersetujuan) {
  return useQuery({
    queryKey: ['useGetRefPersetujuan', params],
    queryFn: async () => {
      const { data } = await api.get<PersetujuanResponse>(
        '/master-data/persetujuan',
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
