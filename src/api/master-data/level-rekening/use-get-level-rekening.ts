import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LevelRekening } from './types'

export function useGetLevelRekening() {
  return useQuery({
    queryKey: ['useGetLevelRekening'],
    queryFn: async () => {
      const { data } = await api.get<LevelRekening[]>(
        '/master-data/level-rekening'
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // cache 5 menit
  })
}
