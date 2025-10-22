import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LogUsersHapusResponse } from './types'

interface UseLogHapusUsers {
  page?: number
  perPage?: number
  search?: string
}

export function useGetLogHapusUsers(params: UseLogHapusUsers) {
  return useQuery({
    queryKey: ['useGetLogHapusUsers', params],
    queryFn: async () => {
      const { data } = await api.get<LogUsersHapusResponse>(
        '/history/log-users-hapus',
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
