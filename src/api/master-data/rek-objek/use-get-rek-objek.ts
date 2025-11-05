import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekObjek } from './types'

interface UseGetRekObjekOptions {
  kd_objek1?: string
  kd_objek2?: string
  kd_objek3?: string
  enabled?: boolean
}

export function useGetRekObjek({
  kd_objek1,
  kd_objek2,
  kd_objek3,
  enabled = true,
}: UseGetRekObjekOptions) {
  return useQuery({
    queryKey: ['useGetRekObjek', kd_objek1, kd_objek2, kd_objek3],
    queryFn: async () => {
      const { data } = await api.get<RekObjek[]>('/master-data/rek-objek', {
        params: { kd_objek1, kd_objek2, kd_objek3 }, // kirim query param jika ada
      })
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    enabled, // aktif atau tidak
  })
}
