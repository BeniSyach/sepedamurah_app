import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type {
  TableCheckFungsionalRequest,
  TableCheckFungsionalResponse,
} from './types'

export function useGetCheckFungsional(params: TableCheckFungsionalRequest) {
  return useQuery({
    queryKey: ['useGetCheckFungsional', params],
    queryFn: async () => {
      const { data } = await api.get<TableCheckFungsionalResponse>(
        '/dashboard/check-fungsional',
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
