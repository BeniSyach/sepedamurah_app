import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SubKegiatan } from './types'

interface CreateSubKegiatanPayload {
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  nm_subkegiatan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefSubKegiatan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateSubKegiatanPayload
    ): Promise<SubKegiatan> => {
      const { data } = await api.post<SubKegiatan>(
        '/master-data/sub-kegiatan',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefSubKegiatan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
