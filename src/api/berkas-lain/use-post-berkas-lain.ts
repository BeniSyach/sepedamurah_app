import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { BerkasLain } from './types'

interface CreateBerkasLainPayload {
  tgl_surat: Date
  nama_file_asli: string
  nama_dokumen: string
  status_tte?: string
  file_sdh_tte?: string
  users_id: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostBerkasLain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateBerkasLainPayload
    ): Promise<BerkasLain> => {
      const { data } = await api.post<BerkasLain>('/berkas-lain', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetBerkasLain'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
