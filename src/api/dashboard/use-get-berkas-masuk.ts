import { useQuery } from '@tanstack/react-query'
import { api } from '../common/client'
import { type Sp2dResponse } from '../sp2d'

interface useReqGetBerkasMasuk {
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
}

export function useGetBerkasMasuk(params: useReqGetBerkasMasuk) {
  return useQuery({
    queryKey: ['useGetBerkasMasuk', params],
    queryFn: async () => {
      const { data } = await api.get<Sp2dResponse>(
        '/dashboard/data-berkas-masuk-sp2d',
        {
          params: {
            kd_opd1: params.kd_opd1 ?? '',
            kd_opd2: params.kd_opd2 ?? '',
            kd_opd3: params.kd_opd3 ?? '',
            kd_opd4: params.kd_opd4 ?? '',
            kd_opd5: params.kd_opd5 ?? '',
          },
        }
      )
      return data
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}
