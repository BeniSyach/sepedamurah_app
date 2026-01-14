import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesRefRekonsiliasiGajiSkpdResponse } from './types'

interface UseAksesRekonsiliasiGajiSkpd {
  page?: number
  perPage?: number
  search?: string
  tahun?: string | number
}

export function useGetAksesRekonsiliasiGajiSkpd(
  params: UseAksesRekonsiliasiGajiSkpd
) {
  return useQuery({
    queryKey: ['useGetAksesRekonsiliasiGajiSkpd', params],
    queryFn: async () => {
      const { data } = await api.get<AksesRefRekonsiliasiGajiSkpdResponse>(
        '/hak-akses/akses-rekonsiliasi-gaji-skpd',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            tahun: params.tahun ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
