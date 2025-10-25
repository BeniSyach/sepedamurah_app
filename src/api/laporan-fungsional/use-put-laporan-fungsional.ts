import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { LaporanFungsional } from './types'

interface UpdateLaporanFungsionalPayload {
  id?: string
  id_pengirim: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_pengirim: string
  id_operator?: string
  nama_operator?: string | null
  jenis_berkas?: string
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutLaporanFungsional() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateLaporanFungsionalPayload
    ): Promise<LaporanFungsional> => {
      const { data } = await api.put<LaporanFungsional>(
        `/laporan/fungsional/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanFungsional'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
