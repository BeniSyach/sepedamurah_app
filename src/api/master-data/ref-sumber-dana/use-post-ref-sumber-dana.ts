import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SumberDana } from './types'

interface CreateSumberDanaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  nm_ref: string
  status: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateSumberDanaPayload
    ): Promise<SumberDana> => {
      const { data } = await api.post<SumberDana>(
        '/master-data/sumber-dana',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefSumberDana'] })
    },
    onError: (err) => {
      return err
    },
  })
}
