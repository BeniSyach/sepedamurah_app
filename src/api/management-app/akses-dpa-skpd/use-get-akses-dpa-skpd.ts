import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesDPAResponse } from './types'

interface UseAksesDPASKPD {
  page?: number
  perPage?: number
  search?: string
  tahun?: string | number
}

export function useGetAksesDPASKPD(params: UseAksesDPASKPD) {
  return useQuery({
    queryKey: ['useGetAksesDPASKPD', params],
    queryFn: async () => {
      const { data } = await api.get<AksesDPAResponse>(
        '/hak-akses/akses-dpa-skpd',
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
