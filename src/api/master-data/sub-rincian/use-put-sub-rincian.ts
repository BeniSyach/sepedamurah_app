import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { SubRincian } from './types'

interface UpdateLevelRekPayload {
  id: string
  kd_subrincian1: string
  kd_subrincian2: string
  kd_subrincian3: string
  kd_subrincian4: string
  kd_subrincian5: string
  kd_subrincian6: string
  nm_sub_rincian: string
}

/**
 * Hook untuk mengupdate data SubRincian (PUT)
 */
export function usePutRefSubRincian() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateLevelRekPayload): Promise<SubRincian> => {
      const { data } = await api.put<SubRincian>(
        `/master-data/sub-rincian/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar SubRincian setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetSubRincian'] })
    },
    onError: (err) => {
      return err
    },
  })
}
