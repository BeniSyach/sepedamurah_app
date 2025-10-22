import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { JenisBelanja } from './types'

interface UpdateJenisBelanjaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  nm_belanja: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefJenisBelanja() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateJenisBelanjaPayload
    ): Promise<JenisBelanja> => {
      const { data } = await api.put<JenisBelanja>(
        `/master-data/jenis-belanja/${payload.kd_ref1}/${payload.kd_ref2}/${payload.kd_ref3}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefJenisBelanja'] })
    },
    onError: (err) => {
      return err
    },
  })
}
