import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BatasWaktuResponse } from './types'

interface UseBatasWaktu {
  page?: number
  perPage?: number
  search?: string
}

export function useGetBatasWaktu(params: UseBatasWaktu) {
  return useQuery({
    queryKey: ['useGetBatasWaktu', params],
    queryFn: async () => {
      const { data } = await api.get<BatasWaktuResponse>(
        '/hak-akses/batas-waktu',
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
