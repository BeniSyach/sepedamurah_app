import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import { type DashboardResponse } from './types'

interface useReqCountData {
  from?: string | undefined
  to?: string | undefined
  tahun?: string | number
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
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
