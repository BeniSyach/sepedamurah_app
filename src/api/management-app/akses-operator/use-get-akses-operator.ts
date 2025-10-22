import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesOperatorResponse } from './types'

interface UseAksesOperator {
  page?: number
  perPage?: number
  search?: string
}

export function useGetAksesOperator(params: UseAksesOperator) {
  return useQuery({
    queryKey: ['useGetAksesOperator', params],
    queryFn: async () => {
      const { data } = await api.get<AksesOperatorResponse>(
        '/hak-akses/akses-operator',
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
