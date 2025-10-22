import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PaguBelanja } from './types'

interface UpdatePaguBelanjaPayload {
  id_pb: number
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefPaguBelanja() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdatePaguBelanjaPayload
    ): Promise<PaguBelanja> => {
      const { data } = await api.put<PaguBelanja>(
        `/master-data/pagu-belanja/${payload.id_pb}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefPaguBelanja'] })
    },
    onError: (err) => {
      return err
    },
  })
}
