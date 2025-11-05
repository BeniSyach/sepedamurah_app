import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LevelRekening } from './types'

interface CreatelevelRekPayload {
  kode: string
  nm_level_rek: string
}

/**
 * Hook untuk membuat data LevelRekening baru (POST)
 */
export function usePostRefLevelRek() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreatelevelRekPayload
    ): Promise<LevelRekening> => {
      const { data } = await api.post<LevelRekening>(
        '/master-data/level-rekening',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar LevelRekening setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetLevelRekening'] })
    },
    onError: (err) => {
      return err
    },
  })
}
