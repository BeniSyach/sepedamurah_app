import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { ProgramResponse } from './types'

interface UseRefProgram {
  page?: number
  perPage?: number
  search?: string
}

export function useGetRefProgram(params: UseRefProgram) {
  return useQuery({
    queryKey: ['useGetRefProgram', params],
    queryFn: async () => {
      const { data } = await api.get<ProgramResponse>('/master-data/program', {
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
