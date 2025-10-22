import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UsersRoleResponse } from './types'

interface UseUserRole {
  page?: number
  perPage?: number
  search?: string
}

export function useGetUserRole(params: UseUserRole) {
  return useQuery({
    queryKey: ['useGetUserRole', params],
    queryFn: async () => {
      const { data } = await api.get<UsersRoleResponse>(
        '/hak-akses/users-role',
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
