import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { ProgramResponse } from './types'

interface UseRefProgramSp2d {
  page?: number
  perPage?: number
  kd_bu1?: string
  kd_bu2?: string
}

export function useGetRefProgramSp2d(params: UseRefProgramSp2d) {
  return useQuery({
    queryKey: ['useGetRefProgramSp2d', params],
    enabled: !!params.kd_bu1 && !!params.kd_bu2,
    queryFn: async () => {
      const { data } = await api.get<ProgramResponse>(
        '/master-data/program-by-pagu-belanja',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            kd_bu1: params.kd_bu1 ?? '',
            kd_bu2: params.kd_bu2 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
