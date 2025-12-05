import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dItem } from './types'

interface CreatePermohonanSp2dPayload {
  tahun?: string
  id_user: string
  nama_user: string
  id_operator?: string
  nama_operator?: string | null
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_file: string
  nama_file_asli: string
  file_tte?: string | null
  tanggal_upload?: string
  kode_file?: string
  diterima?: string | null
  ditolak?: string | null
  alasan_tolak?: string | null
  proses?: string | null
  supervisor_proses?: string | null
  no_spm: string
  jenis_berkas: string
  id_berkas: string[]
  agreement: string
  kd_belanja1?: string | null
  kd_belanja2?: string | null
  kd_belanja3?: string | null
  jenis_belanja?: string | null
  nilai_belanja: string
  status_laporan?: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostPermohonanSp2d() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePermohonanSp2dPayload | FormData) => {
      const { data } = await api.post<Sp2dItem>(
        '/sp2d/permohonan-sp2d',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSP2D'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetSP2DKirim'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
