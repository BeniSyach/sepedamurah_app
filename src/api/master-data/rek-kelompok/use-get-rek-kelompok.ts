import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekKelompok } from './types'

interface UseGetRekKelompokOptions {
  kd_kel1?: string
  enabled?: boolean
}

export function useGetRekKelompok({
  kd_kel1,
  enabled = true,
}: UseGetRekKelompokOptions) {
  return useQuery({
    queryKey: ['useGetRekKelompok', kd_kel1],
    queryFn: async () => {
      const { data } = await api.get<RekKelompok[]>(
        '/master-data/rek-kelompok',
        {
          params: { kd_kel1 }, // kirim query param jika ada
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    enabled, // aktif atau tidak
  })
}
