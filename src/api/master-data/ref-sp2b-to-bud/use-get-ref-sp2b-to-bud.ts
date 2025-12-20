import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefSp2dbToBUDPaginatedResponse } from './types'

interface UseRefSp2bToBUD {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefSp2bToBUD(params: UseRefSp2bToBUD) {
  return useQuery({
    queryKey: ['useGetRefSp2bToBUD', params],
    queryFn: async () => {
      const { data } = await api.get<RefSp2dbToBUDPaginatedResponse>(
        '/master-data/ref-sp2b-to-bud',
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
