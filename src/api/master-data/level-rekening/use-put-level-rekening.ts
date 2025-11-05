import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LevelRekening } from './types'

interface UpdateLevelRekPayload {
  kode: string
  nm_level_rek: string
}

/**
 * Hook untuk mengupdate data LevelRekening (PUT)
 */
export function usePutRefLevelRekening() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateLevelRekPayload
    ): Promise<LevelRekening> => {
      const { data } = await api.put<LevelRekening>(
        `/master-data/level-rekening/${payload.kode}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar LevelRekening setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetLevelRekening'] })
    },
    onError: (err) => {
      return err
    },
  })
}
