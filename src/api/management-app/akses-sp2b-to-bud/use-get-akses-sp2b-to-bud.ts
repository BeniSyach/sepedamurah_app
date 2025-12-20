import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesSp2bToBUDResponse } from './types'

interface UseAksesSp2bToBUD {
  page?: number
  perPage?: number
  search?: string
}

export function useGetAksesSp2bToBUD(params: UseAksesSp2bToBUD) {
  return useQuery({
    queryKey: ['useGetAksesSp2bToBUD', params],
    queryFn: async () => {
      const { data } = await api.get<AksesSp2bToBUDResponse>(
        '/hak-akses/akses-sp2b-ke-bud',
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
