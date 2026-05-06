import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { TableGetBelanjaSKPDRequest, BelanjaResponse } from './types'

export function useGetBelanjaSKPD(params: TableGetBelanjaSKPDRequest) {
  return useQuery({
    queryKey: ['useGetBelanjaSKPD', params],
    queryFn: async () => {
      const { data } = await api.get<BelanjaResponse>(
        '/dashboard/monitoring-belanja-skpd',
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
