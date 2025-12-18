import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LaporanBelanjaResponse } from './types'

interface UseLaporanRealisasiBelanja {
  tahun?: number | string
  bulan?: number | string
  search?: number | string
}

export function useGetLaporanRealisasiBelanja(
  params: UseLaporanRealisasiBelanja
) {
  return useQuery({
    queryKey: ['useGetLaporanRealisasiBelanja', params],
    queryFn: async () => {
      const { data } = await api.get<LaporanBelanjaResponse>(
        '/laporan/realisasi-belanja',
        {
          params: {
            search: params.search ?? '',
            tahun: params.tahun ?? '',
            bulan: params.bulan ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
