import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekJenis } from './types'

interface UpdateLevelRekPayload {
  id: string
  kd_jenis1: string
  kd_jenis2: string
  kd_jenis3: string
  nm_rek_jenis: string
}

/**
 * Hook untuk mengupdate data RekJenis (PUT)
 */
export function usePutRefRekJenis() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateLevelRekPayload): Promise<RekJenis> => {
      const { data } = await api.put<RekJenis>(
        `/master-data/rek-jenis/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar RekJenis setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRekJenis'] })
    },
    onError: (err) => {
      return err
    },
  })
}
