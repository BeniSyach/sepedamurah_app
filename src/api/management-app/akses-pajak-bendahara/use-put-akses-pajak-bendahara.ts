import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesPajakBendaharaResponse } from './types'

interface UpdateAksesPajakBendaharaPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  pajakIds: string[]
  tahun: string
}

export function usePutAksesPajakBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateAksesPajakBendaharaPayload
    ): Promise<AksesPajakBendaharaResponse> => {
      const { data } = await api.put<AksesPajakBendaharaResponse>(
        `/hak-akses/akses-pajak-bendahara/${payload.kd_opd1}/${payload.kd_opd2}/${payload.kd_opd3}/${payload.kd_opd4}/${payload.kd_opd5}/${payload.tahun}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesPajakBendahara'],
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
