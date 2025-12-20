import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesAssetBendaharaResponse } from './types'

interface CreateAksesAssetBendaharaPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  assetIds: string[]
  tahun: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostAksesAssetBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAksesAssetBendaharaPayload
    ): Promise<AksesAssetBendaharaResponse> => {
      const { data } = await api.post<AksesAssetBendaharaResponse>(
        '/hak-akses/akses-asset-bendahara',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesAssetBendahara'],
      })
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useCekLaporanDPA'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
