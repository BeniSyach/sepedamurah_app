import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PermohonanSpd } from './types'

interface CreatePermohonanSpdPayload {
  id_pengirim: string
  nama_pengirim: string
  id_operator?: string
  nama_operator?: string | null
  jenis_berkas?: string | null
  nama_file: string
  nama_file_asli: string
  kode_file?: string
  diterima?: string | null
  ditolak?: string | null
  alasan_tolak?: string | null
  proses?: string | null
  supervisor_proses?: string | null
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostPermohonanSpd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreatePermohonanSpdPayload
    ): Promise<PermohonanSpd> => {
      const { data } = await api.post<PermohonanSpd>(
        '/spd/permohonan-spd',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetPermohonanSPD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
