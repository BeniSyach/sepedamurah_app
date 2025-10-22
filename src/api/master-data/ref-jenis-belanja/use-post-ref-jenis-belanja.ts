import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { JenisBelanja } from './types'

interface CreateJenisBelanjaPayload {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  nm_belanja: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefJenisBelanja() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateJenisBelanjaPayload
    ): Promise<JenisBelanja> => {
      const { data } = await api.post<JenisBelanja>(
        '/master-data/jenis-belanja',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefJenisBelanja'] })
    },
    onError: (err) => {
      return err
    },
  })
}
