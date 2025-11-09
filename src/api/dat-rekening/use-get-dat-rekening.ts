import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { PaginatedDatRekening } from './types'

interface UseRefRekening {
  page?: number
  perPage?: number
  search?: string
  status_rek?: string
}

export function useGetDatRekening(params: UseRefRekening) {
  return useQuery({
    queryKey: ['useGetDatRekening', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedDatRekening>('/dat-rekening', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
          status_rek: params.status_rek,
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
