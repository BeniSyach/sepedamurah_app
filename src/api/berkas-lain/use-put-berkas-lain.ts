import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { BerkasLain } from './types'

interface UpdateBerkasLainPayload {
  id?: string
  tgl_surat: Date
  nama_file_asli: string
  nama_dokumen: string
  status_tte?: string
  file_sdh_tte?: string
  users_id: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutBerkasLain() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateBerkasLainPayload
    ): Promise<BerkasLain> => {
      const { data } = await api.put<BerkasLain>(
        `/laporan/fungsional/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetBerkasLain'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
