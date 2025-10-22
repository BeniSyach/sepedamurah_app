import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { UsersResponse } from './types'

interface UseUsersQueryParams {
  page?: number
  perPage?: number
  search?: string
  status?: string[]
  role?: string[]
}

export function useUsersQuery(params: UseUsersQueryParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await api.get<UsersResponse>('/users', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
          status: params.status?.join(','),
          role: params.role?.join(','),
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
