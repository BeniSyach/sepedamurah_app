import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekAkun } from './types'

interface UpdateLevelRekPayload {
  kode: string
  nm_level_rek: string
}

/**
 * Hook untuk mengupdate data RekAkun (PUT)
 */
export function usePutRefRekAkun() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateLevelRekPayload): Promise<RekAkun> => {
      const { data } = await api.put<RekAkun>(
        `/master-data/rek-akun/${payload.kode}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar RekAkun setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRekAkun'] })
    },
    onError: (err) => {
      return err
    },
  })
}
