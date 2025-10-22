import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SubKegiatanResponse } from './types'

interface UseRefSubKegiatan {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefSubKegiatan(params: UseRefSubKegiatan) {
  return useQuery({
    queryKey: ['useGetRefSubKegiatan', params],
    queryFn: async () => {
      const { data } = await api.get<SubKegiatanResponse>(
        '/master-data/sub-kegiatan',
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
