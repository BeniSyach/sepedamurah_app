import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UrusanResponse } from './types'

interface UseRefUrusan {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefUrusan(params: UseRefUrusan) {
  return useQuery({
    queryKey: ['useGetRefUrusan', params],
    queryFn: async () => {
      const { data } = await api.get<UrusanResponse>('/master-data/urusan', {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 10,
          search: params.search ?? '',
        },
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
