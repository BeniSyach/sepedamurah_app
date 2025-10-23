import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { BerkasLainResponse } from './types'

interface UseBerkasLain {
  page?: number
  perPage?: number
  search?: string
  user_id?: string | number
}

export function useGetBerkasLain(params: UseBerkasLain) {
  return useQuery({
    queryKey: ['useGetBerkasLain', params],
    queryFn: async () => {
      const { data } = await api.get<BerkasLainResponse>('/berkas-lain', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
          user_id: params.user_id,
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
