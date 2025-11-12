import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { PaginatedDatRekening } from './types'

interface UpdateRekeningPayload {
  kd_rek1: string
  kd_rek2: string
  kd_rek3: string
  kd_rek4: string
  kd_rek5: string
  kd_rek6: string
  nm_rekening: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutDatRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateRekeningPayload
    ): Promise<PaginatedDatRekening> => {
      const { data } = await api.put<PaginatedDatRekening>(
        `/master-data/rekening/${payload.kd_rek1}/${payload.kd_rek2}/${payload.kd_rek3}/${payload.kd_rek4}/${payload.kd_rek5}/${payload.kd_rek6}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetDatRekening'] })
    },
    onError: (err) => {
      return err
    },
  })
}
