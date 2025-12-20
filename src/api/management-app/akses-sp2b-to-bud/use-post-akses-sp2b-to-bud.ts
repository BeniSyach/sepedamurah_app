import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesSp2bToBUDResponse } from './types'

interface CreateAksesSp2bToBUDPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  sp2bIds: string[]
  tahun: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostAksesSp2bToBUD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAksesSp2bToBUDPayload
    ): Promise<AksesSp2bToBUDResponse> => {
      const { data } = await api.post<AksesSp2bToBUDResponse>(
        '/hak-akses/akses-sp2b-ke-bud',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesSp2bToBUD'],
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
