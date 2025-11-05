import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekAkun } from './types'

export function useGetRekAkun() {
  return useQuery({
    queryKey: ['useGetRekAkun'],
    queryFn: async () => {
      const { data } = await api.get<RekAkun[]>('/master-data/rek-akun')
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // cache 5 menit
  })
}
