import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/common/client'
import type { LaporanDPAResponse } from './types'

interface UseLaporanDPA {
  page?: number
  perPage?: number
  search?: string
  jenis?: string
  menu?: string
  user_id?: string | number
}

export function useGetLaporanDPA(params: UseLaporanDPA) {
  return useQuery({
    queryKey: ['useGetLaporanDPA', params],
    queryFn: async () => {
      const { data } = await api.get<LaporanDPAResponse>(
        '/laporan/laporan-dpa',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            jenis: params.jenis,
            menu: params.menu,
            user_id: params.user_id,
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
