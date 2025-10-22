import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Rekening } from './types'

interface CreateRekeningPayload {
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
  nm_rekening: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRekeningPayload): Promise<Rekening> => {
      const { data } = await api.post<Rekening>(
        '/master-data/rekening',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefRekening'] })
    },
    onError: (err) => {
      return err
    },
  })
}
