import { useQuery } from '@tanstack/react-query'
import { api } from '../../common/client'

interface CekUploadParams {
  tahun: number
  bulan: number
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  status: string
}

interface CekUploadResponse {
  status: boolean
  missing_pengeluaran: number[]
  missing_penerimaan: number[]
}

export function useCekUploadFungsional(params: CekUploadParams) {
  return useQuery({
    queryKey: ['cekUploadFungsional', params],
    queryFn: async () => {
      const { data } = await api.get<CekUploadResponse>(
        '/laporan/cek-upload-fungsional',
        { params }
      )
      return data
    },
    enabled:
      !!params.tahun &&
      !!params.bulan &&
      !!params.kd_opd1 &&
      !!params.kd_opd2 &&
      !!params.kd_opd3 &&
      !!params.kd_opd4 &&
      !!params.kd_opd5,
    staleTime: 1000 * 60 * 5, // 5 menit
  })
}
