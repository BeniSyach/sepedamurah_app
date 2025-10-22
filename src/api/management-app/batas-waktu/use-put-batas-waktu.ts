import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BatasWaktu } from './types'

interface UpdateBatasWaktuPayload {
  id?: string
  hari: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  waktu_awal: string // contoh: "08:00"
  waktu_akhir: string // contoh: "14:30"
  istirahat_awal: string // contoh: "12:00"
  istirahat_akhir: string // contoh: "13:00"
  keterangan: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutBatasWaktu() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateBatasWaktuPayload
    ): Promise<BatasWaktu> => {
      const { data } = await api.put<BatasWaktu>(
        `/hak-akses/batas-waktu/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetBatasWaktu'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
