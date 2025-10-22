import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { BatasWaktu } from './types'

interface CreateBatasWaktuPayload {
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
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostBatasWaktu() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateBatasWaktuPayload
    ): Promise<BatasWaktu> => {
      const { data } = await api.post<BatasWaktu>(
        '/hak-akses/batas-waktu',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetBatasWaktu'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
