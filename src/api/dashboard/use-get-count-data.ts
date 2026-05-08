import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import { type DashboardResponse } from './types'

interface useReqCountData {
  from?: string | undefined
  to?: string | undefined
  tahun?: string | number
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
}

export function useGetCountData(params: useReqCountData) {
  return useQuery({
    queryKey: ['useGetCountData', params],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>(
        '/dashboard/count-data',
        {
          params: {
            from: params.from ?? '',
            to: params.to ?? '',
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
