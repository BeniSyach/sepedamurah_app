import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UpSkpd } from './types'

interface CreateUpSkpdPayload {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  tahun: string
  pagu: string
  up_kkpd: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostUpSkpd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUpSkpdPayload): Promise<UpSkpd> => {
      const { data } = await api.post<UpSkpd>('/alokasi-dana/up-skpd', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetUPSKPD'] })
    },
    onError: (err) => {
      return err
    },
  })
}
