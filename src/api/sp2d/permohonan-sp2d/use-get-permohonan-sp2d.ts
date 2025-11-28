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
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
