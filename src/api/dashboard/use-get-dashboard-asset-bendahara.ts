import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type {
  TableGetPajakBendaharaRequest,
  DashboardPajakBendaharaResponse,
} from './types'

export function useGetDashboardAssetBendahara(
  params: TableGetPajakBendaharaRequest
) {
  return useQuery({
    queryKey: ['useGetDashboardAssetBendahara', params],
    queryFn: async () => {
      const { data } = await api.get<DashboardPajakBendaharaResponse>(
        '/laporan/dashboard-asset-bendahara',
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
