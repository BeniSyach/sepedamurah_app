import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { CeklisKelengkapanDokumenResponse } from './types'

interface UseRefCeklisSPM {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefCeklisSPM(params: UseRefCeklisSPM) {
  return useQuery({
    queryKey: ['useGetRefCeklisSPM', params],
    queryFn: async () => {
      const { data } = await api.get<CeklisKelengkapanDokumenResponse>(
        '/master-data/ceklis-kelengkapan-dokumen',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
