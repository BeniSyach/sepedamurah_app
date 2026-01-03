import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesPajakBendaharaResponse } from './types'

interface UseAksesPajakBendahara {
  page?: number
  perPage?: number
  search?: string
  tahun?: string | number
}

export function useGetAksesPajakBendahara(params: UseAksesPajakBendahara) {
  return useQuery({
    queryKey: ['useGetAksesPajakBendahara', params],
    queryFn: async () => {
      const { data } = await api.get<AksesPajakBendaharaResponse>(
        '/hak-akses/akses-pajak-bendahara',
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
