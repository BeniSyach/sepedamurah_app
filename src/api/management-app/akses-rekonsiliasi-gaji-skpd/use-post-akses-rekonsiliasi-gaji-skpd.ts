import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesRefRekonsiliasiGajiSkpdResponse } from './types'

interface CreateAksesRekonsiliasiGajiSkpdPayload {
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

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostAksesRekonsiliasiGajiSkpd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAksesRekonsiliasiGajiSkpdPayload
    ): Promise<AksesRefRekonsiliasiGajiSkpdResponse> => {
      const { data } = await api.post<AksesRefRekonsiliasiGajiSkpdResponse>(
        '/hak-akses/akses-rekonsiliasi-gaji-skpd',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesRekonsiliasiGajiSkpd'],
      })
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetLaporanRekonsiliasiGajiSKPD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
