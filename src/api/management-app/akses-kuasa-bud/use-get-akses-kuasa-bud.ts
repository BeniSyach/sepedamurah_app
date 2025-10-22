import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesKuasaBudResponse } from './types'

interface UseAksesKuasaBUD {
  page?: number
  perPage?: number
  search?: string
}

export function useGetAksesKuasaBUD(params: UseAksesKuasaBUD) {
  return useQuery({
    queryKey: ['useGetAksesKuasaBUD', params],
    queryFn: async () => {
      const { data } = await api.get<AksesKuasaBudResponse>(
        '/hak-akses/akses-kuasa-bud',
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
