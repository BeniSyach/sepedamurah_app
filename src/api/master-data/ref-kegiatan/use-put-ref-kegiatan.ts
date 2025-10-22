import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Kegiatan } from './types'

interface UpdateKegiatanPayload {
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  nm_kegiatan: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefKegiatan() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateKegiatanPayload): Promise<Kegiatan> => {
      const { data } = await api.put<Kegiatan>(
        `/master-data/kegiatan/${payload.kd_keg1}/${payload.kd_keg2}/${payload.kd_keg3}/${payload.kd_keg4}/${payload.kd_keg5}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefKegiatan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
