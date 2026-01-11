import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { BerkasLainResponse } from './types'

interface UseBerkasLain {
  page?: number
  perPage?: number
  search?: string
  user_id?: string | number
  tahun?: string | number
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
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
          tahun: params.tahun ?? '',
          kd_opd1: params.kd_opd1 ?? '',
          kd_opd2: params.kd_opd2 ?? '',
          kd_opd3: params.kd_opd3 ?? '',
          kd_opd4: params.kd_opd4 ?? '',
          kd_opd5: params.kd_opd5 ?? '',
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
