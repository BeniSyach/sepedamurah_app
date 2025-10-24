import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LaporanBelanjaResponse } from './types'

interface UseLaporanRealisasiBelanja {
  tahun?: number | string
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
            tahun: params.tahun ?? 2025,
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
