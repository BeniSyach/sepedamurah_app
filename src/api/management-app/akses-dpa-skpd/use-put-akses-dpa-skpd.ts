import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesDPAResponse } from './types'

interface UpdateAksesDPASKPDPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  dpaIds: string[]
  tahun: string
}

export function usePutAksesDPASKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateAksesDPASKPDPayload
    ): Promise<AksesDPAResponse> => {
      const { data } = await api.put<AksesDPAResponse>(
        `/hak-akses/akses-dpa-skpd/${payload.kd_opd1}/${payload.kd_opd2}/${payload.kd_opd3}/${payload.kd_opd4}/${payload.kd_opd5}/${payload.tahun}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesDPASKPD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
