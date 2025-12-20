import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefSp2dbToBUDPaginatedResponse } from './types'

interface CreateSp2bToBUDPayload {
  nm_sp2b_ke_bud: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefSp2bToBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateSp2bToBUDPayload
    ): Promise<RefSp2dbToBUDPaginatedResponse> => {
      const { data } = await api.post<RefSp2dbToBUDPaginatedResponse>(
        '/master-data/ref-sp2b-to-bud',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefSp2bToBUD'] })
    },
    onError: (err) => {
      return err
    },
  })
}
