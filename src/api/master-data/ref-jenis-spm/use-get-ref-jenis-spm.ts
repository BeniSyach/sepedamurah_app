import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { JenisSpmResponse } from './types'

interface UseRefJenisSPM {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefJenisSPM(params: UseRefJenisSPM) {
  return useQuery({
    queryKey: ['useGetRefJenisSPM', params],
    queryFn: async () => {
      const { data } = await api.get<JenisSpmResponse>(
        '/master-data/jenis-spm',
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
