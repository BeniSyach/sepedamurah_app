import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefAssetBendaharaPaginatedResponse } from './types'

interface CreateAssetBendaharaPayload {
  nm_asset_bendahara: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefAssetBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAssetBendaharaPayload
    ): Promise<RefAssetBendaharaPaginatedResponse> => {
      const { data } = await api.post<RefAssetBendaharaPaginatedResponse>(
        '/master-data/ref-asset-bendahara',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefAssetBendahara'] })
    },
    onError: (err) => {
      return err
    },
  })
}
