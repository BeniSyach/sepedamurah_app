import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefDpaPaginatedResponse } from './types'

interface CreateDPAPayload {
  nm_dpa: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefDPA() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateDPAPayload
    ): Promise<RefDpaPaginatedResponse> => {
      const { data } = await api.post<RefDpaPaginatedResponse>(
        '/master-data/ref-dpa',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefDPA'] })
    },
    onError: (err) => {
      return err
    },
  })
}
