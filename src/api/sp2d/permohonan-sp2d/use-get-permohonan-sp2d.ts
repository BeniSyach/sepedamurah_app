import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dResponse } from './types'

interface UsePermohonanSP2D {
  page?: number
  perPage?: number
  search?: string
}

export function useGetPermohonanSP2D(params: UsePermohonanSP2D) {
  return useQuery({
    queryKey: ['useGetPermohonanSP2D', params],
    queryFn: async () => {
      const { data } = await api.get<Sp2dResponse>('/sp2d/permohonan-sp2d', {
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
