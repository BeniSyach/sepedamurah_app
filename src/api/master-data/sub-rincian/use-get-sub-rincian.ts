import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SubRincian } from './types'

interface UseGetSubRincianOptions {
  kd_subrincian1?: string
  kd_subrincian2?: string
  kd_subrincian3?: string
  kd_subrincian4?: string
  kd_subrincian5?: string
  enabled?: boolean
}

export function useGetSubRincian({
  kd_subrincian1,
  kd_subrincian2,
  kd_subrincian3,
  kd_subrincian4,
  kd_subrincian5,
  enabled = true,
}: UseGetSubRincianOptions) {
  return useQuery({
    queryKey: [
      'useGetSubRincian',
      kd_subrincian1,
      kd_subrincian2,
      kd_subrincian3,
      kd_subrincian4,
      kd_subrincian5,
    ],
    queryFn: async () => {
      const { data } = await api.get<SubRincian[]>('/master-data/sub-rincian', {
        params: {
          kd_subrincian1,
          kd_subrincian2,
          kd_subrincian3,
          kd_subrincian4,
          kd_subrincian5,
        }, // kirim query param jika ada
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    enabled, // aktif atau tidak
  })
}
