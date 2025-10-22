import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { JenisBelanjaResponse } from './types'

interface UseRefJenisBelanja {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefJenisBelanja(params: UseRefJenisBelanja) {
  return useQuery({
    queryKey: ['useGetRefJenisBelanja', params],
    queryFn: async () => {
      const { data } = await api.get<JenisBelanjaResponse>(
        '/master-data/jenis-belanja',
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
