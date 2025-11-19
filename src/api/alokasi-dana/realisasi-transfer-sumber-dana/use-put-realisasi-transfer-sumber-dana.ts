import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RealisasiTransferSumberDana } from './types'

interface UpdateRealisasiTransferSumberDanaPayload {
  id?: string
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRealisasiTransferSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateRealisasiTransferSumberDanaPayload
    ): Promise<RealisasiTransferSumberDana> => {
      const { data } = await api.put<RealisasiTransferSumberDana>(
        `/alokasi-dana/realisasi-transfer-sumber-dana/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
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
