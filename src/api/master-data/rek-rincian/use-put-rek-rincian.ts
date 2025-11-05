import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekRincian } from './types'

interface UpdateLevelRekPayload {
  id: string
  kd_rincian1: string
  kd_rincian2: string
  kd_rincian3: string
  kd_rincian4: string
  kd_rincian5: string
  nm_rek_rincian: string
}

/**
 * Hook untuk mengupdate data RekRincian (PUT)
 */
export function usePutRefRekRincian() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateLevelRekPayload): Promise<RekRincian> => {
      const { data } = await api.put<RekRincian>(
        `/master-data/rek-rincian/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar RekRincian setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRekRincian'] })
    },
    onError: (err) => {
      return err
    },
  })
}
