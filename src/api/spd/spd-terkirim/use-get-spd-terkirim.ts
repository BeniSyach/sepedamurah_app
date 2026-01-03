import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SpdTerkirimResponse } from './types'

interface UseSPDTerkirim {
  page?: number
  perPage?: number
  search?: string
  menu?: string
  user_id?: string | number
  tahun?: string | number
}

export function useGetSPDTerkirim(params: UseSPDTerkirim) {
  return useQuery({
    queryKey: ['useGetSPDTerkirim', params],
    queryFn: async () => {
      const { data } = await api.get<SpdTerkirimResponse>('/spd/spd-terkirim', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
          menu: params.menu,
          user_id: params.user_id,
          tahun: params.tahun ?? '',
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
