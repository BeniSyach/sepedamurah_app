import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekapSumberDanaResponse } from './types'

interface UseRekapRealisasiTransferSumberDana {
  search?: string
  tahun?: string | number
}

export function useGetRekapRealisasiTransferSumberDana(
  params: UseRekapRealisasiTransferSumberDana
) {
  return useQuery({
    queryKey: ['useGetRekapRealisasiTransferSumberDana', params],
    queryFn: async () => {
      const { data } = await api.get<RekapSumberDanaResponse>(
        '/alokasi-dana/realisasi-transfer-sumber-dana',
        {
          params: {
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
