import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { KegiatanResponse } from './types'

interface UseRefKegiatan {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefKegiatan(params: UseRefKegiatan) {
  return useQuery({
    queryKey: ['useGetRefKegiatan', params],
    queryFn: async () => {
      const { data } = await api.get<KegiatanResponse>(
        '/master-data/kegiatan',
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
