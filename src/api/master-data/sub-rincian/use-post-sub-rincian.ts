import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SubRincian } from './types'

interface CreateSubRincianPayload {
  kd_subrincian1: string
  kd_subrincian2: string
  kd_subrincian3: string
  kd_subrincian4: string
  kd_subrincian5: string
  kd_subrincian6: string
  nm_sub_rincian: string
}

/**
 * Hook untuk membuat data SubRincian baru (POST)
 */
export function usePostRefSubRincian() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateSubRincianPayload
    ): Promise<SubRincian> => {
      const { data } = await api.post<SubRincian>(
        '/master-data/sub-rincian',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar SubRincian setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetSubRincian'] })
    },
    onError: (err) => {
      return err
    },
  })
}
