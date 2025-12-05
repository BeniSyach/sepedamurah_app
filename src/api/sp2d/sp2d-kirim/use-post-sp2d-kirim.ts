import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dData } from './types'

interface CreateSp2dKirimPayload {
  tahun: string
  id_berkas: string
  id_penerima: string
  nama_penerima: string
  id_operator: string
  nama_operator: string
  namafile: string
  nama_file_asli: string
  tanggal_upload: string
  keterangan: string
  diterima: string | null
  ditolak: string | null
  tte: string | null
  status: string
  tgl_tte: string
  alasan_tolak: string | null
  tgl_kirim_kebank: string
  id_penandatangan: string
  nama_penandatangan: string
  file_tte: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  publish: string | null
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostSp2dKirim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSp2dKirimPayload | FormData) => {
      const { data } = await api.post<Sp2dData>('/sp2d/sp2d-kirim', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetSP2DKirim'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSP2D'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
