import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesAssetBendaharaResponse } from './types'

interface UpdateAksesAssetBendaharaPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  assetIds: string[]
  tahun: string
}

export function usePutAksesAssetBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateAksesAssetBendaharaPayload
    ): Promise<AksesAssetBendaharaResponse> => {
      const { data } = await api.put<AksesAssetBendaharaResponse>(
        `/hak-akses/akses-asset-bendahara/${payload.kd_opd1}/${payload.kd_opd2}/${payload.kd_opd3}/${payload.kd_opd4}/${payload.kd_opd5}/${payload.tahun}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesAssetBendahara'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useCekLaporanDPA'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
