import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { MasterSkpdResponse } from './types'

interface UseRefSKPD {
  page?: number
  perPage?: number
  search?: string
  hidden?: string
}

export function useGetRefSKPD(params: UseRefSKPD) {
  return useQuery({
    queryKey: ['useGetRefSKPD', params],
    queryFn: async () => {
      const { data } = await api.get<MasterSkpdResponse>(
        '/master-data/master-skpd',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            hidden: params.hidden ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
