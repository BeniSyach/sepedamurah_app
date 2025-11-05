import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekRincian } from './types'

interface UseGetRekRincianOptions {
  kd_rincian1?: string
  kd_rincian2?: string
  kd_rincian3?: string
  kd_rincian4?: string
  enabled?: boolean
}

export function useGetRekRincian({
  kd_rincian1,
  kd_rincian2,
  kd_rincian3,
  kd_rincian4,
  enabled = true,
}: UseGetRekRincianOptions) {
  return useQuery({
    queryKey: [
      'useGetRekRincian',
      kd_rincian1,
      kd_rincian2,
      kd_rincian3,
      kd_rincian4,
    ],
    queryFn: async () => {
      const { data } = await api.get<RekRincian[]>('/master-data/rek-rincian', {
        params: { kd_rincian1, kd_rincian2, kd_rincian3, kd_rincian4 }, // kirim query param jika ada
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    enabled, // aktif atau tidak
  })
}
