import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/common/client'
import { type LaporanDPA } from './types'

interface CreateLaporanDPAPayload {
  user_id: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  id_operator?: string
  nama_operator?: string | null
  nama_file?: string
  nama_file_asli: string
  tanggal_upload?: string
  kode_file?: string
  tahun: string
  diterima?: string | null
  ditolak?: string | null
  alasan_tolak?: string | null
  proses?: string | null
  supervisor_proses?: string | null
  berkas_tte?: string | null
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostLaporanDPA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateLaporanDPAPayload | FormData) => {
      const { data } = await api.post<LaporanDPA>(
        '/laporan/laporan-dpa',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanDPA'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetMonitoringDPA'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
