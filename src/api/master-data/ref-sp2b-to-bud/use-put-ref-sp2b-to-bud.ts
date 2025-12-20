import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefSp2dbToBUDPaginatedResponse } from './types'

interface UpdateSp2bToBUDPayload {
  id?: string
  nm_sp2b_ke_bud: string
}

/**
 * Hook untuk mengupdate data DPA (PUT)
 */
export function usePutRefSp2bToBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateSp2bToBUDPayload
    ): Promise<RefSp2dbToBUDPaginatedResponse> => {
      const { data } = await api.put<RefSp2dbToBUDPaginatedResponse>(
        `/master-data/ref-sp2b-to-bud/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar DPA setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefSp2bToBUD'] })
    },
    onError: (err) => {
      return err
    },
  })
}
