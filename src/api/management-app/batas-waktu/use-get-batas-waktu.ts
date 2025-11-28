import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BatasWaktuResponse } from './types'

interface UseBatasWaktu {
  page?: number
  perPage?: number
  search?: string
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
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
            kd_opd1: params.kd_opd1 ?? '',
            kd_opd2: params.kd_opd2 ?? '',
            kd_opd3: params.kd_opd3 ?? '',
            kd_opd4: params.kd_opd4 ?? '',
            kd_opd5: params.kd_opd5 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
