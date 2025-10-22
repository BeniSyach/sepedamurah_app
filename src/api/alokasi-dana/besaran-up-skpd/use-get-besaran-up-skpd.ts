import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UpSkpdResponse } from './types'

interface UseUPSKPD {
  page?: number
  perPage?: number
  search?: string
}

export function useGetUPSKPD(params: UseUPSKPD) {
  return useQuery({
    queryKey: ['useGetUPSKPD', params],
    queryFn: async () => {
      const { data } = await api.get<UpSkpdResponse>('/alokasi-dana/up-skpd', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
