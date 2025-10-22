import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { JenisSpm } from './types'

interface CreateJenisSPMPayload {
  kategori: string
  nama_berkas: string
  status_penerimaan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefJenisSPM() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateJenisSPMPayload): Promise<JenisSpm> => {
      const { data } = await api.post<JenisSpm>(
        '/master-data/jenis-spm',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefJenisSPM'] })
    },
    onError: (err) => {
      return err
    },
  })
}
