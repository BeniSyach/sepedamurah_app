import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekKelompok } from './types'

interface CreateRekKelompokPayload {
  kd_kel1: string
  kd_kel2: string
  nm_rek_kelompok: string
}

/**
 * Hook untuk membuat data RekKelompok baru (POST)
 */
export function usePostRefRekKelompok() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateRekKelompokPayload
    ): Promise<RekKelompok> => {
      const { data } = await api.post<RekKelompok>(
        '/master-data/rek-kelompok',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar RekKelompok setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRekKelompok'] })
    },
    onError: (err) => {
      return err
    },
  })
}
