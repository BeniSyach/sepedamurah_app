import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { PaguSumberDana } from './types'

interface CreatePaguSumberDanaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  tahun: string
  tgl_rekam: string
  pagu: string
  jumlah_silpa: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostPaguSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreatePaguSumberDanaPayload
    ): Promise<PaguSumberDana> => {
      const { data } = await api.post<PaguSumberDana>(
        '/alokasi-dana/pagu-sumber-dana',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetPaguSumberDana'] })
    },
    onError: (err) => {
      return err
    },
  })
}
