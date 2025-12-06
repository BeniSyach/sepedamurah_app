import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { TableCheckFungsionalRequest, SummaryResponse } from './types'

export function useGetCountFungsional(params: TableCheckFungsionalRequest) {
  return useQuery({
    queryKey: ['useGetCountFungsional', params],
    queryFn: async () => {
      const { data } = await api.get<SummaryResponse>(
        '/dashboard/count-fungsional',
        {
          params,
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
