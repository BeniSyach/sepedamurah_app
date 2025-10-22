import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Rekening } from './types'

interface UpdateRekeningPayload {
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
  nm_rekening: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateRekeningPayload): Promise<Rekening> => {
      const { data } = await api.put<Rekening>(
        `/master-data/rekening/${payload.kd_rekening1}/${payload.kd_rekening2}/${payload.kd_rekening3}/${payload.kd_rekening4}/${payload.kd_rekening5}/${payload.kd_rekening6}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefRekening'] })
    },
    onError: (err) => {
      return err
    },
  })
}
