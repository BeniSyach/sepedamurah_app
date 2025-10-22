import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SubKegiatan } from './types'

interface UpdateSubKegiatanPayload {
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  nm_subkegiatan: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefSubKegiatan() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateSubKegiatanPayload
    ): Promise<SubKegiatan> => {
      const { data } = await api.put<SubKegiatan>(
        `/master-data/sub-kegiatan/${payload.kd_subkeg1}/${payload.kd_subkeg2}/${payload.kd_subkeg3}/${payload.kd_subkeg4}/${payload.kd_subkeg5}/${payload.kd_subkeg6}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefSubKegiatan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
