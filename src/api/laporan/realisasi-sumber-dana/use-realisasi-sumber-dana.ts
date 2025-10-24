import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LaporanRealisasiSumberDanaResponse } from './types'

interface UseLaporanRealisasiSumberDana {
  tahun?: number | string
}

export function useGetLaporanRealisasiSumberDana(
  params: UseLaporanRealisasiSumberDana
) {
  return useQuery({
    queryKey: ['useGetLaporanRealisasiSumberDana', params],
    queryFn: async () => {
      const { data } = await api.get<LaporanRealisasiSumberDanaResponse>(
        '/laporan/realisasi-sumber-dana',
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
