import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesRefRekonsiliasiGajiSkpdResponse } from './types'

interface UpdateAksesRekonsiliasiGajiSkpdPayload {
  opd: {
    kd_opd1: string
    kd_opd2: string
    kd_opd3: string
    kd_opd4: string
    kd_opd5: string
  }[]
  rekGajiIds: string[]
  tahun: string
}

export function usePutAksesRekonsiliasiGajiSkpd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateAksesRekonsiliasiGajiSkpdPayload
    ): Promise<AksesRefRekonsiliasiGajiSkpdResponse> => {
      const { data } = await api.put<AksesRefRekonsiliasiGajiSkpdResponse>(
        `/hak-akses/akses-rekonsiliasi-gaji-skpd`,
        payload
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesRekonsiliasiGajiSkpd'],
      })
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanRekonsiliasiGajiSKPD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
