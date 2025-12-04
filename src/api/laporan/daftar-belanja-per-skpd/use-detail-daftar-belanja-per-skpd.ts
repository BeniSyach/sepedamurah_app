import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { DetailDaftarBelanjaSKPD } from './types'

interface UseGetDetailDaftarBelanjaSKPD {
  tahun: number | string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

export function useGetDetailDaftarBelanjaSKPD(
  params: UseGetDetailDaftarBelanjaSKPD
) {
  return useQuery({
    queryKey: ['useGetDetailDaftarBelanjaSKPD', params],
    queryFn: async () => {
      const { data } = await api.get<DetailDaftarBelanjaSKPD>(
        '/laporan/detail/daftar-belanja-skpd',
        { params }
      )
      return data
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
