import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefDpaPaginatedResponse } from './types'

interface UseRefDPA {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefDPA(params: UseRefDPA) {
  return useQuery({
    queryKey: ['useGetRefDPA', params],
    queryFn: async () => {
      const { data } = await api.get<RefDpaPaginatedResponse>(
        '/master-data/ref-dpa',
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
