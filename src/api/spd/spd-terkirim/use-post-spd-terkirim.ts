import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SpdTerkirim } from './types'

interface CreateSpdTerkirimPayload {
  id_berkas?: string | null
  id_penerima: string
  nama_penerima: string
  id_operator: string
  nama_operator: string
  namafile?: string
  nama_file_asli: string
  nama_file_lampiran?: string | null
  tanggal_upload?: string
  keterangan: string
  paraf_kbud?: string
  tgl_paraf?: string
  tte?: string
  passpharase?: string | null
  status?: string
  tgl_tte?: string
  id_penandatangan?: string
  nama_penandatangan?: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  file_tte?: string
  publish?: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostSpdTerkirim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSpdTerkirimPayload | FormData) => {
      const { data } = await api.post<SpdTerkirim>(
        '/spd/spd-terkirim',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetSPDTerkirim'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSPD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
