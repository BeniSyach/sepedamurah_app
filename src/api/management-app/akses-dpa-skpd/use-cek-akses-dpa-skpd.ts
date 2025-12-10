import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'

interface CekLaporanDPAParams {
  tahun: number
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
}

export function useCekLaporanDPA(params: CekLaporanDPAParams) {
  return useQuery({
    queryKey: ['useCekLaporanDPA', params],
    queryFn: async () => {
      const { data } = await api.get('/hak-akses/cek-akses-dpa-skpd', {
        params: {
          tahun: params.tahun,
          kd_opd1: params.kd_opd1,
          kd_opd2: params.kd_opd2,
          kd_opd3: params.kd_opd3,
          kd_opd4: params.kd_opd4,
          kd_opd5: params.kd_opd5,
        },
      })
      return data
    },
    enabled: !!params.tahun, // hanya fetch jika tahun terisi
    staleTime: 1000 * 60 * 1, // cache 5 menit
    placeholderData: (previous) => previous,
  })
}
