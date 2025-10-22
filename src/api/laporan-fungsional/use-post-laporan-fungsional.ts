import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { LaporanFungsional } from './types'

interface CreateLaporanFungsionalPayload {
  id_pengirim: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_pengirim: string
  id_operator: string
  nama_operator: string | null
  jenis_berkas: string
  nama_file: string
  nama_file_asli: string
  tanggal_upload: string
  kode_file: string
  tahun: string
  diterima: string | null
  ditolak: string | null
  alasan_tolak: string | null
  proses: string | null
  supervisor_proses: string | null
  berkas_tte: string | null
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostLaporanFungsional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateLaporanFungsionalPayload
    ): Promise<LaporanFungsional> => {
      const { data } = await api.post<LaporanFungsional>(
        '/laporan/fungsional',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanFungsional'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
