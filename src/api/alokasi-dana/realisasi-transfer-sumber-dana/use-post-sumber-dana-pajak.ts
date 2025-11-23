import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RealisasiTransferSumberDana } from './types'

/**
 * Hook untuk sinkronisasi data Realisasi Transfer Sumber Dana
 */
export function useSyncRealisasiTransferSumberDanaPajak() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<RealisasiTransferSumberDana> => {
      // POST tanpa payload
      const { data } = await api.post<RealisasiTransferSumberDana>(
        '/alokasi-dana/sinkron-sumber-dana-pajak'
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetRealisasiTransferSumberSumberDana'],
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
