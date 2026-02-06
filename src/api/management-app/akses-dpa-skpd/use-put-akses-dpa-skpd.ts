import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesDPAResponse } from './types'

interface UpdateAksesDPASKPDPayload {
  tahun: string
  dpaIds: string[]
  opd: {
    kd_opd1: string
    kd_opd2: string
    kd_opd3: string
    kd_opd4: string
    kd_opd5: string
  }[]
}

export function usePutAksesDPASKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateAksesDPASKPDPayload
    ): Promise<AksesDPAResponse> => {
      const { data } = await api.put<AksesDPAResponse>(
        `/hak-akses/akses-dpa-skpd`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesDPASKPD'],
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
