import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PaguBelanja } from './types'

interface CreatePaguBelanjaPayload {
  tahun_rek: string | null
  kd_urusan: string
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
  jumlah_pagu: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefPaguBelanja() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreatePaguBelanjaPayload
    ): Promise<PaguBelanja> => {
      const { data } = await api.post<PaguBelanja>(
        '/master-data/pagu-belanja',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefPaguBelanja'] })
    },
    onError: (err) => {
      return err
    },
  })
}
