import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import { type Sp2dChartResponse } from './types'

interface useReqCountData {
  tahun?: string | undefined
}

export function useGetSp2dChart(params: useReqCountData) {
  return useQuery({
    queryKey: ['useGetSp2dChart', params],
    queryFn: async () => {
      const { data } = await api.get<Sp2dChartResponse>(
        '/dashboard/chart-sp2d-per-bulan',
        {
          params: {
            tahun: params.tahun ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
