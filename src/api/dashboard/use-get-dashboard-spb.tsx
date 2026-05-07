import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type {
  TableGetPajakBendaharaRequest,
  DashboardPajakBendaharaResponse,
} from './types'

export function useGetDashboardSPB(params: TableGetPajakBendaharaRequest) {
  return useQuery({
    queryKey: ['useGetDashboardSPB', params],
    queryFn: async () => {
      const { data } = await api.get<DashboardPajakBendaharaResponse>(
        '/laporan/dashboard-spb',
        {
          params,
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
