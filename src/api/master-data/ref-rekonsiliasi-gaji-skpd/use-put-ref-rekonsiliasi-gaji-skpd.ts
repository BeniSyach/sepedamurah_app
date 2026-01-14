import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefRekonsiliasiGajiSkpdPaginatedResponse } from './types'

interface UpdateRekonsiliasiGajiSkpdPayload {
  id?: string
  nm_rekonsiliasi_gaji_skpd: string
}

/**
 * Hook untuk mengupdate data DPA (PUT)
 */
export function usePutRefuseGetRefRekonsiliasiGajiSkpd() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateRekonsiliasiGajiSkpdPayload
    ): Promise<RefRekonsiliasiGajiSkpdPaginatedResponse> => {
      const { data } = await api.put<RefRekonsiliasiGajiSkpdPaginatedResponse>(
        `/master-data/ref-rekonsiliasi-gaji-skpd/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar DPA setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetRefRekonsiliasiGajiSkpd'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
