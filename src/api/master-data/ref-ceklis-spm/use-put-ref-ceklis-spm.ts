import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { CeklisKelengkapanDokumen } from './types'

interface UpdateuseGetRefCeklisSPMPayload {
  id?: string
  kategori: string
  status: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefuseGetRefCeklisSPM() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateuseGetRefCeklisSPMPayload
    ): Promise<CeklisKelengkapanDokumen> => {
      const { data } = await api.put<CeklisKelengkapanDokumen>(
        `/master-data/ceklis-kelengkapan-dokumen/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefCeklisSPM'] })
    },
    onError: (err) => {
      return err
    },
  })
}
