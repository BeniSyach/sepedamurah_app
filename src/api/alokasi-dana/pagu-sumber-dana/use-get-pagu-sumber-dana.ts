import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PaguSumberDanaResponse } from './types'

interface UsePaguSumberDana {
  page?: number
  perPage?: number
  search?: string
}

export function useGetPaguSumberDana(params: UsePaguSumberDana) {
  return useQuery({
    queryKey: ['useGetPaguSumberDana', params],
    queryFn: async () => {
      const { data } = await api.get<PaguSumberDanaResponse>(
        '/alokasi-dana/pagu-sumber-dana',
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
