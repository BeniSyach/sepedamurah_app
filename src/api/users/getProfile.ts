import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import type { ProfileResponse } from './types'

export function useProfile() {
  return useQuery<ProfileResponse>({
    queryKey: ['useProfile'],
    queryFn: async () => {
      const { data } = await api.get<ProfileResponse>('/users/me')
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 menit cache
  })
}
