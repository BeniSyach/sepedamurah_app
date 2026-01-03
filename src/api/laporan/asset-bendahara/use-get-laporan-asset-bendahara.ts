import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/common/client'
import type { LaporanAssetBendaharaResponse } from './types'

interface UseLaporanAssetBendahara {
  page?: number
  perPage?: number
  search?: string
  jenis?: string
  menu?: string
  user_id?: string | number
  tahun?: string | number
}

export function useGetLaporanAssetBendahara(params: UseLaporanAssetBendahara) {
  return useQuery({
    queryKey: ['useGetLaporanAssetBendahara', params],
    queryFn: async () => {
      const { data } = await api.get<LaporanAssetBendaharaResponse>(
        '/laporan/laporan-asset-bendahara',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            jenis: params.jenis,
            menu: params.menu,
            user_id: params.user_id,
            tahun: params.tahun ?? '',
          },
        }
      )

      return data
    },

    // agar pagination lancar
    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 5, // 5 menit
  })
}
