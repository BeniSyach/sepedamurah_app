import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PaguBelanjaResponse } from './types'

interface UseRefPaguBelanja {
  page?: number
  perPage?: number
  search?: string
  sort_by?: string | undefined
  sort_dir?: string | undefined
}

export function useGetRefPaguBelanja(params: UseRefPaguBelanja) {
  return useQuery({
    queryKey: ['useGetRefPaguBelanja', params],
    queryFn: async () => {
      const { data } = await api.get<PaguBelanjaResponse>(
        '/master-data/pagu-belanja',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            search: params.search ?? '',
            sort_by: params.sort_by ?? '',
            sort_dir: params.sort_dir ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
