import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RealisasiTransferSumberDana } from './types'

interface CreateRealisasiTransferSumberDanaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  nm_sumber: string
  tgl_diterima: string
  tahun: string
  jumlah_sumber: string
  keterangan?: string
  keterangan_2?: string | null
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRealisasiTransferSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateRealisasiTransferSumberDanaPayload
    ): Promise<RealisasiTransferSumberDana> => {
      const { data } = await api.post<RealisasiTransferSumberDana>(
        '/alokasi-dana/realisasi-transfer-sumber-dana',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetRealisasiTransferSumberDana'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetRekapRealisasiTransferSumberDana'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
