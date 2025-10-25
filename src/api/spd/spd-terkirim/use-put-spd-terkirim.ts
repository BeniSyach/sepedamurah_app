import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SpdTerkirim } from './types'

interface UpdateSpdTerkirimPayload {
  id?: string
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutSpdTerkirim() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateSpdTerkirimPayload
    ): Promise<SpdTerkirim> => {
      const { data } = await api.put<SpdTerkirim>(
        `/spd/spd-terkirim/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetSPDTerkirim'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
