import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RealisasiTransferSumberDanaResponse } from './types'

interface UseRealisasiTransferSumberDana {
  page?: number
  perPage?: number
  search?: string
  tahun?: string | number
  enabled?: boolean
  kd_ref1?: string
  kd_ref2?: string
  kd_ref3?: string
  kd_ref4?: string
  kd_ref5?: string
  kd_ref6?: string
}

export function useGetRealisasiTransferSumberSumberDana(
  params: UseRealisasiTransferSumberDana
) {
  return useQuery({
    queryKey: [
      'useGetRealisasiTransferSumberSumberDana',
      params.page ?? 1,
      params.perPage ?? 10,
      params.search ?? '',
      params.tahun ?? '',
      params.kd_ref1 ?? '',
      params.kd_ref2 ?? '',
      params.kd_ref3 ?? '',
      params.kd_ref4 ?? '',
      params.kd_ref5 ?? '',
      params.kd_ref6,
    ],

    enabled: params.enabled ?? true, // default aktif

    queryFn: async () => {
      const { data } = await api.get<RealisasiTransferSumberDanaResponse>(
        '/alokasi-dana/detail-realisasi-transfer-sumber-dana',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            tahun: params.tahun ?? '',
            kd_ref1: params.kd_ref1 ?? '',
            kd_ref2: params.kd_ref2 ?? '',
            kd_ref3: params.kd_ref3 ?? '',
            kd_ref4: params.kd_ref4 ?? '',
            kd_ref5: params.kd_ref5 ?? '',
            kd_ref6: params.kd_ref6 ?? '',
          },
        }
      )
      return data
    },

    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
