import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import { type Sp2dResponse } from '../sp2d'

export function useGetBerkasMasuk() {
  return useQuery({
    queryKey: ['useGetBerkasMasuk'],
    queryFn: async () => {
      const { data } = await api.get<Sp2dResponse>(
        '/dashboard/data-berkas-masuk-sp2d'
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
