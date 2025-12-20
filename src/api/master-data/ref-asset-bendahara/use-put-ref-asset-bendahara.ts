import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefAssetBendaharaPaginatedResponse } from './types'

interface UpdateAssetBendaharaPayload {
  id?: string
  nm_asset_bendahara: string
}

/**
 * Hook untuk mengupdate data DPA (PUT)
 */
export function usePutRefAssetBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateAssetBendaharaPayload
    ): Promise<RefAssetBendaharaPaginatedResponse> => {
      const { data } = await api.put<RefAssetBendaharaPaginatedResponse>(
        `/master-data/ref-asset-bendahara/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar DPA setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefAssetBendahara'] })
    },
    onError: (err) => {
      return err
    },
  })
}
