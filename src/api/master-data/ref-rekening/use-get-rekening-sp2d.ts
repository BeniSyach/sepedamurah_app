import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekeningResponse } from './types'

interface UseRefRekeningSp2d {
  page?: number
  perPage?: number
  kd_subkeg1?: string
  kd_subkeg2?: string
  kd_subkeg3?: string
  kd_subkeg4?: string
  kd_subkeg5?: string
  kd_subkeg6?: string
  role?: string
}

export function useGetRefRekeningSp2d(params: UseRefRekeningSp2d) {
  return useQuery({
    queryKey: ['useGetRefRekeningSp2d', params],
    enabled:
      !!params.kd_subkeg1 &&
      !!params.kd_subkeg2 &&
      !!params.kd_subkeg3 &&
      !!params.kd_subkeg4 &&
      !!params.kd_subkeg5 &&
      !!params.kd_subkeg6,
    queryFn: async () => {
      const { data } = await api.get<RekeningResponse>(
        '/master-data/rekening-by-pagu-belanja',
        {
          params: {
            page: params.page ?? 1,
            per_page: params.perPage ?? 10,
            kd_subkeg1: params.kd_subkeg1 ?? '',
            kd_subkeg2: params.kd_subkeg2 ?? '',
            kd_subkeg3: params.kd_subkeg3 ?? '',
            kd_subkeg4: params.kd_subkeg4 ?? '',
            kd_subkeg5: params.kd_subkeg5 ?? '',
            kd_subkeg6: params.kd_subkeg6 ?? '',
            role: params.role,
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
