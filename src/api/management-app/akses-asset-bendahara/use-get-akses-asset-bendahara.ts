import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesAssetBendaharaResponse } from './types'

interface UseAksesAssetBendahara {
  page?: number
  perPage?: number
  search?: string
}

export function useGetAksesAssetBendahara(params: UseAksesAssetBendahara) {
  return useQuery({
    queryKey: ['useGetAksesAssetBendahara', params],
    queryFn: async () => {
      const { data } = await api.get<AksesAssetBendaharaResponse>(
        '/hak-akses/akses-asset-bendahara',
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
