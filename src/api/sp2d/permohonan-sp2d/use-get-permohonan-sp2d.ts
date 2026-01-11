import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dResponse } from './types'

interface UsePermohonanSP2D {
  page?: number
  perPage?: number
  search?: string
  menu?: string
  user_id?: string | number
  operator_id?: string | number
  level_akses?: string
  date_from?: string | undefined
  date_to?: string | undefined
  sort_by?: string | undefined
  sort_dir?: string | undefined
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
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
          menu: params.menu,
          user_id: params.user_id,
          level_akses: params.level_akses,
          date_from: params.date_from,
          date_to: params.date_to,
          sort_by: params.sort_by,
          sort_dir: params.sort_dir,
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
