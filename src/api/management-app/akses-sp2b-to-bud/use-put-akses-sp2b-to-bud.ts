import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesSp2bToBUDResponse } from './types'

interface UpdateAksesSp2bToBUDPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  sp2bIds: string[]
  tahun: string
}

export function usePutAksesSp2bToBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateAksesSp2bToBUDPayload
    ): Promise<AksesSp2bToBUDResponse> => {
      const { data } = await api.put<AksesSp2bToBUDResponse>(
        `/hak-akses/akses-sp2b-ke-bud/${payload.kd_opd1}/${payload.kd_opd2}/${payload.kd_opd3}/${payload.kd_opd4}/${payload.kd_opd5}/${payload.tahun}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesSp2bToBUD'],
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
