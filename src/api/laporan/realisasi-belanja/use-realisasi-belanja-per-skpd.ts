import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LaporanBelanjaResponse } from './types'

interface UseLaporanRealisasiBelanja {
  tahun?: number | string
  bulan?: number | string
  search?: number | string
  kd_opd1?: number | string
  kd_opd2?: number | string
  kd_opd3?: number | string
  kd_opd4?: number | string
  kd_opd5?: number | string
}

export function useGetLaporanRealisasiBelanjaPerSKPD(
  params: UseLaporanRealisasiBelanja
) {
  return useQuery({
    queryKey: ['useGetLaporanRealisasiBelanjaPerSKPD', params],
    queryFn: async () => {
      const { data } = await api.get<LaporanBelanjaResponse>(
        '/laporan/laporan-belanja-opd',
        {
          params: {
            search: params.search ?? '',
            tahun: params.tahun ?? '',
            bulan: params.bulan ?? '',
            kd_opd1: params.kd_opd1 ?? '',
            kd_opd2: params.kd_opd2 ?? '',
            kd_opd3: params.kd_opd3 ?? '',
            kd_opd4: params.kd_opd4 ?? '',
            kd_opd5: params.kd_opd5 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
