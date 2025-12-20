import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefAssetBendaharaPaginatedResponse } from './types'

interface UseRefAssetBendahara {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefAssetBendahara(params: UseRefAssetBendahara) {
  return useQuery({
    queryKey: ['useGetRefAssetBendahara', params],
    queryFn: async () => {
      const { data } = await api.get<RefAssetBendaharaPaginatedResponse>(
        '/master-data/ref-asset-bendahara',
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
