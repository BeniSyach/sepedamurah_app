import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekJenis } from './types'

interface UseGetRekJenisOptions {
  kd_jenis1?: string
  kd_jenis2?: string
  enabled?: boolean
}

export function useGetRekJenis({
  kd_jenis1,
  kd_jenis2,
  enabled = true,
}: UseGetRekJenisOptions) {
  return useQuery({
    queryKey: ['useGetRekJenis', kd_jenis1, kd_jenis2],
    queryFn: async () => {
      const { data } = await api.get<RekJenis[]>('/master-data/rek-jenis', {
        params: { kd_jenis1, kd_jenis2 }, // kirim query param jika ada
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    enabled, // aktif atau tidak
  })
}
