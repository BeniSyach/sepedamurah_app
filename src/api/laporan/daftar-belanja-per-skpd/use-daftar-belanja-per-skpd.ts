import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LaporanDaftarBelanjaSKPD } from './types'

interface UseLaporanDaftarBelanjaSKPD {
  tahun?: number | string
}

export function useGetLaporanDaftarBelanjaSKPD(
  params: UseLaporanDaftarBelanjaSKPD
) {
  return useQuery({
    queryKey: ['useGetLaporanDaftarBelanjaSKPD', params],
    queryFn: async () => {
      const { data } = await api.get<LaporanDaftarBelanjaSKPD>(
        '/laporan/daftar-belanja-skpd',
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
