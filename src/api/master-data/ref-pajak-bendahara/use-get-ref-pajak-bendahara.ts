import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefPajakBendaharaPaginatedResponse } from './types'

interface UseRefPajakBendahara {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefPajakBendahara(params: UseRefPajakBendahara) {
  return useQuery({
    queryKey: ['useGetRefPajakBendahara', params],
    queryFn: async () => {
      const { data } = await api.get<RefPajakBendaharaPaginatedResponse>(
        '/master-data/ref-pajak-bendahara',
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
