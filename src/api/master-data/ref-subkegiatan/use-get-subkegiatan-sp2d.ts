import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SubKegiatanResponse } from './types'

interface UseRefSubKegiatanSp2d {
  page?: number
  perPage?: number
  kd_keg1?: string
  kd_keg2?: string
  kd_keg3?: string
  kd_keg4?: string
  kd_keg5?: string
}

export function useGetRefSubKegiatanSp2d(params: UseRefSubKegiatanSp2d) {
  return useQuery({
    queryKey: ['useGetRefSubKegiatanSp2d', params],
    enabled:
      !!params.kd_keg1 &&
      !!params.kd_keg2 &&
      !!params.kd_keg3 &&
      !!params.kd_keg4 &&
      !!params.kd_keg5,
    queryFn: async () => {
      const { data } = await api.get<SubKegiatanResponse>(
        '/master-data/sub-kegiatan-by-pagu-belanja',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            kd_keg1: params.kd_keg1 ?? '',
            kd_keg2: params.kd_keg2 ?? '',
            kd_keg3: params.kd_keg3 ?? '',
            kd_keg4: params.kd_keg4 ?? '',
            kd_keg5: params.kd_keg5 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
