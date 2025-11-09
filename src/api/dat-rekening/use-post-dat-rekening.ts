import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { PaginatedDatRekening } from './types'

interface CreateRekeningPayload {
  kd_rek1: string
  kd_rek2: string
  kd_rek3: string
  kd_rek4: string
  kd_rek5: string
  kd_rek6: string
  nm_rekening: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateRekeningPayload
    ): Promise<PaginatedDatRekening> => {
      const { data } = await api.post<PaginatedDatRekening>(
        '/dat-rekening',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetDatRekening'] })
    },
    onError: (err) => {
      return err
    },
  })
}
