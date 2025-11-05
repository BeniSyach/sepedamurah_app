import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekKelompok } from './types'

interface UpdateLevelRekPayload {
  id: string
  kd_kel1: string
  kd_kel2: string
  nm_rek_kelompok: string
}

/**
 * Hook untuk mengupdate data RekKelompok (PUT)
 */
export function usePutRefRekKelompok() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateLevelRekPayload
    ): Promise<RekKelompok> => {
      const { data } = await api.put<RekKelompok>(
        `/master-data/rek-kelompok/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar RekKelompok setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRekKelompok'] })
    },
    onError: (err) => {
      return err
    },
  })
}
