import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesDPAResponse } from './types'

interface CreateAksesDPASKPDPayload {
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

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostAksesDPASKPD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAksesDPASKPDPayload
    ): Promise<AksesDPAResponse> => {
      const { data } = await api.post<AksesDPAResponse>(
        '/hak-akses/akses-dpa-skpd',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesDPASKPD'],
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
