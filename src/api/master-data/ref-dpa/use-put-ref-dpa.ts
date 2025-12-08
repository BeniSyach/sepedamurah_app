import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefDpaPaginatedResponse } from './types'

interface UpdateDPAPayload {
  id?: string
  nm_dpa: string
}

/**
 * Hook untuk mengupdate data DPA (PUT)
 */
export function usePutRefDPA() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateDPAPayload
    ): Promise<RefDpaPaginatedResponse> => {
      const { data } = await api.put<RefDpaPaginatedResponse>(
        `/master-data/ref-dpa/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar DPA setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefDPA'] })
    },
    onError: (err) => {
      return err
    },
  })
}
