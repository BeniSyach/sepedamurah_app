import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekRincian } from './types'

interface CreateRekRincianPayload {
  kd_rincian1: string
  kd_rincian2: string
  kd_rincian3: string
  kd_rincian4: string
  kd_rincian5: string
  nm_rek_rincian: string
}

/**
 * Hook untuk membuat data RekRincian baru (POST)
 */
export function usePostRefRekRincian() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateRekRincianPayload
    ): Promise<RekRincian> => {
      const { data } = await api.post<RekRincian>(
        '/master-data/rek-rincian',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar RekRincian setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRekRincian'] })
    },
    onError: (err) => {
      return err
    },
  })
}
