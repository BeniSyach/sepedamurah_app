import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dKirimResponse } from './types'

interface UseSP2DKirim {
  page?: number
  perPage?: number
  search?: string
}

export function useGetSP2DKirim(params: UseSP2DKirim) {
  return useQuery({
    queryKey: ['useGetSP2DKirim', params],
    queryFn: async () => {
      const { data } = await api.get<Sp2dKirimResponse>('/sp2d/sp2d-kirim', {
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
