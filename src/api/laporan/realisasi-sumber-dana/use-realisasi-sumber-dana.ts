import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LaporanRealisasiSumberDanaResponse } from './types'

interface UseLaporanRealisasiSumberDana {
  tahun?: number | string
  search?: string
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
            search: params.search ?? '',
            _t: Date.now(),
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    refetchOnMount: true, // ✅ refetch setiap mount
    refetchOnWindowFocus: true, // ✅ refetch saat tab aktif lagi
  })
}
