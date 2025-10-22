import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Persetujuan } from './types'

interface CreatePersetujuanPayload {
  konten: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefPersetujuan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreatePersetujuanPayload
    ): Promise<Persetujuan> => {
      const { data } = await api.post<Persetujuan>(
        '/master-data/ceklis-kelengkapan-dokumen',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefPersetujuan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
