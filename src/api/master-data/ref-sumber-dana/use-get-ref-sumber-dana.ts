import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SumberDanaResponse } from './types'

interface UseRefSumberDana {
  page?: number
  perPage?: number
  search?: string
  status?: string
}

export function useGetRefSumberDana(params: UseRefSumberDana) {
  return useQuery({
    queryKey: ['useGetRefSumberDana', params],
    queryFn: async () => {
      const { data } = await api.get<SumberDanaResponse>(
        '/master-data/sumber-dana',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            status: params.status ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
