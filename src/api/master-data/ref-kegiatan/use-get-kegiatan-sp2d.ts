import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { KegiatanResponse } from './types'

interface UseRefKegiatanSp2d {
  page?: number
  perPage?: number
  kd_prog1?: string
  kd_prog2?: string
  kd_prog3?: string
}

export function useGetRefKegiatanSp2d(params: UseRefKegiatanSp2d) {
  return useQuery({
    queryKey: ['useGetRefKegiatanSp2d', params],
    enabled: !!(params.kd_prog1 && params.kd_prog2 && params.kd_prog3),
    queryFn: async () => {
      const { data } = await api.get<KegiatanResponse>(
        '/master-data/kegiatan-by-pagu-belanja',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            kd_prog1: params.kd_prog1 ?? '',
            kd_prog2: params.kd_prog2 ?? '',
            kd_prog3: params.kd_prog3 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
