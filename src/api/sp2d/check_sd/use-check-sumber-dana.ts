import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { CheckSumberDanaResponse } from './types'

interface UseCheckSumberDana {
  tahun?: number | string
}

export function useGetCheckSumberDana(params: UseCheckSumberDana) {
  return useQuery({
    queryKey: ['useGetCheckSumberDana', params],
    queryFn: async () => {
      const { data } = await api.get<CheckSumberDanaResponse>(
        '/sp2d/sp2d-sumber-dana/check_sd',
        {
          params: {
            tahun: params.tahun ?? 2025,
            _t: Date.now(),
          },
        }
      )
      return data
    },
  })
}
