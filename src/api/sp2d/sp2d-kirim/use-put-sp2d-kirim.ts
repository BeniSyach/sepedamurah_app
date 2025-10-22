import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Sp2dData } from './types'

interface UpdateSp2DKirimPayload {
  id: string
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutSp2DKirim() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateSp2DKirimPayload): Promise<Sp2dData> => {
      const { data } = await api.put<Sp2dData>(
        `/sp2d/sp2d-kirim/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetSP2DKirim'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
