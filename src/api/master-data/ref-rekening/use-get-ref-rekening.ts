import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekeningResponse } from './types'

interface UseRefRekening {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefRekening(params: UseRefRekening) {
  return useQuery({
    queryKey: ['useGetRefRekening', params],
    queryFn: async () => {
      const { data } = await api.get<RekeningResponse>(
        '/master-data/rekening',
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
