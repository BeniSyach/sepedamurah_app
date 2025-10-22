import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Kegiatan } from './types'

interface CreateKegiatanPayload {
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  nm_kegiatan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefKegiatan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateKegiatanPayload): Promise<Kegiatan> => {
      const { data } = await api.post<Kegiatan>(
        '/master-data/kegiatan',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefKegiatan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
