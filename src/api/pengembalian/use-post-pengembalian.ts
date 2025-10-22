import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { Pengembalian } from './types'

interface CreatePengembalianPayload {
  no_sts: string
  nik: string
  nama: string
  alamat: string
  tahun: string
  kd_rek1: string
  kd_rek2: string
  kd_rek3: string
  kd_rek4: string
  kd_rek5: string
  kd_rek6: string
  nm_rekening: string
  keterangan: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  jml_pengembalian: string
  tgl_rekam: string
  jml_yang_disetor: string | null
  tgl_setor: string
  nip_perekam: string
  kode_pengesahan: string
  kode_cabang: string
  nama_channel: string
  status_pembayaran_pajak: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostPengembalian() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreatePengembalianPayload
    ): Promise<Pengembalian> => {
      const { data } = await api.post<Pengembalian>('/pengembalian', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetPengembalian'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
