import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { CeklisKelengkapanDokumen } from './types'

interface CreateCeklisSPMPayload {
  kategori: string
  status: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefCeklisSPM() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateCeklisSPMPayload
    ): Promise<CeklisKelengkapanDokumen> => {
      const { data } = await api.post<CeklisKelengkapanDokumen>(
        '/master-data/ceklis-kelengkapan-dokumen',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefCeklisSPM'] })
    },
    onError: (err) => {
      return err
    },
  })
}
