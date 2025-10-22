import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SumberDana } from './types'

interface UpdateSumberDanaPayload {
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
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefSumberDana() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateSumberDanaPayload
    ): Promise<SumberDana> => {
      const { data } = await api.put<SumberDana>(
        `/master-data/sumber-dana/${payload.kd_ref1}/${payload.kd_ref2}/${payload.kd_ref3}/${payload.kd_ref4}/${payload.kd_ref5}/${payload.kd_ref6}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefSumberDana'] })
    },
    onError: (err) => {
      return err
    },
  })
}
