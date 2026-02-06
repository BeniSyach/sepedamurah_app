import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesPajakBendaharaResponse } from './types'

interface CreateAksesPajakBendaharaPayload {
  opd: {
    kd_opd1: string
    kd_opd2: string
    kd_opd3: string
    kd_opd4: string
    kd_opd5: string
  }[]
  pajakIds: string[]
  tahun: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostAksesPajakBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAksesPajakBendaharaPayload
    ): Promise<AksesPajakBendaharaResponse> => {
      const { data } = await api.post<AksesPajakBendaharaResponse>(
        '/hak-akses/akses-pajak-bendahara',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesPajakBendahara'],
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
