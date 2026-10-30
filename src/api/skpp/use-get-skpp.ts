import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { SkppResponse } from './types'

export interface UseGetSkppParams {
  page?: number
  perPage?: number
  search?: string
  nomor?: string
  date_from?: string
  date_to?: string
  filter_tanggal?: string
  sort_by?: string
  sort_dir?: string
  status?: string
  menu?: string
  jenis_skpp?: string
  tahun?: string | number
  user_id?: string | number
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
}

export function useGetSkpp(params: UseGetSkppParams = {}) {
  return useQuery({
    queryKey: ['useGetSkpp', params],
    queryFn: async () => {
      const { data } = await api.get<SkppResponse>('/skpp', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
          status: params.status ?? 'all',
          menu: params.menu ?? '',
          tahun: params.tahun ?? '',
          ...(params.jenis_skpp ? { jenis_skpp: params.jenis_skpp } : {}),
          ...(params.nomor ? { nomor: params.nomor } : {}),
          ...(params.date_from ? { date_from: params.date_from } : {}),
          ...(params.date_to ? { date_to: params.date_to } : {}),
          ...(params.filter_tanggal ? { filter_tanggal: params.filter_tanggal } : {}),
          ...(params.sort_by ? { sort_by: params.sort_by } : {}),
          ...(params.sort_dir ? { sort_dir: params.sort_dir } : {}),
          ...(params.user_id ? { user_id: params.user_id } : {}),
          ...(params.kd_opd1 ? { kd_opd1: params.kd_opd1 } : {}),
          ...(params.kd_opd2 ? { kd_opd2: params.kd_opd2 } : {}),
          ...(params.kd_opd3 ? { kd_opd3: params.kd_opd3 } : {}),
          ...(params.kd_opd4 ? { kd_opd4: params.kd_opd4 } : {}),
          ...(params.kd_opd5 ? { kd_opd5: params.kd_opd5 } : {}),
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 menit
  })
}
