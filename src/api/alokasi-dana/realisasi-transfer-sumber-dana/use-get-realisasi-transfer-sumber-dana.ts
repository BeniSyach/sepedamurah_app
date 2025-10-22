import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RealisasiTransferSumberDanaResponse } from './types'

interface UseRealisasiTransferSumberDana {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRealisasiTransferSumberDana(
  params: UseRealisasiTransferSumberDana
) {
  return useQuery({
    queryKey: ['useGetRealisasiTransferSumberDana', params],
    queryFn: async () => {
      const { data } = await api.get<RealisasiTransferSumberDanaResponse>(
        '/alokasi-dana/realisasi-transfer-sumber-dana',
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
