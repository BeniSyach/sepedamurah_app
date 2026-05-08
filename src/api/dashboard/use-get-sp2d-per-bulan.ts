import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import { type Sp2dChartResponse } from './types'

interface useReqCountData {
  tahun?: number
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
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
            kd_opd1: params.kd_opd1 ?? '',
            kd_opd2: params.kd_opd2 ?? '',
            kd_opd3: params.kd_opd3 ?? '',
            kd_opd4: params.kd_opd4 ?? '',
            kd_opd5: params.kd_opd5 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
