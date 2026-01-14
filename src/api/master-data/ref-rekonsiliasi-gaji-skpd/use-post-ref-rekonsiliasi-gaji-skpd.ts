import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefRekonsiliasiGajiSkpdPaginatedResponse } from './types'

interface CreateRekonsiliasiGajiSkpdPayload {
  nm_rekonsiliasi_gaji_skpd: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefRekonsiliasiGajiSkpd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateRekonsiliasiGajiSkpdPayload
    ): Promise<RefRekonsiliasiGajiSkpdPaginatedResponse> => {
      const { data } = await api.post<RefRekonsiliasiGajiSkpdPaginatedResponse>(
        '/master-data/ref-rekonsiliasi-gaji-skpd',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetRefRekonsiliasiGajiSkpd'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
