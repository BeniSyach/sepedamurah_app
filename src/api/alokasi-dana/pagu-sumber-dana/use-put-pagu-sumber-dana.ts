import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PaguSumberDana } from './types'

interface UpdatePaguSumberDanaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  tahun: string
  tgl_rekam: Date
  pagu: string
  jumlah_silpa: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutPaguSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdatePaguSumberDanaPayload
    ): Promise<PaguSumberDana> => {
      const { data } = await api.put<PaguSumberDana>(
        `/alokasi-dana/pagu-sumber-dana/${payload.kd_ref1}/${payload.kd_ref2}/${payload.kd_ref3}/${payload.kd_ref4}/${payload.kd_ref5}/${payload.kd_ref6}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetPaguSumberDana'] })
    },
    onError: (err) => {
      return err
    },
  })
}
