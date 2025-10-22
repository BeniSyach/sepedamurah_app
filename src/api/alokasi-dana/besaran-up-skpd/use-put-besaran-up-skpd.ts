import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UpSkpd } from './types'

interface UpdateUpSkpdPayload {
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutUpSkpd() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateUpSkpdPayload): Promise<UpSkpd> => {
      const { data } = await api.put<UpSkpd>(
        `/alokasi-dana/up-skpd/${payload.kd_opd1}/${payload.kd_opd2}/${payload.kd_opd3}/${payload.kd_opd4}/${payload.kd_opd5}/${payload.tahun}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetUPSKPD'] })
    },
    onError: (err) => {
      return err
    },
  })
}
