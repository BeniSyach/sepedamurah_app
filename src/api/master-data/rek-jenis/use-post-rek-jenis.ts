import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekJenis } from './types'

interface CreateRekJenisPayload {
  kd_jenis1: string
  kd_jenis2: string
  kd_jenis3: string
  nm_rek_jenis: string
}

/**
 * Hook untuk membuat data RekJenis baru (POST)
 */
export function usePostRefRekJenis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRekJenisPayload): Promise<RekJenis> => {
      const { data } = await api.post<RekJenis>(
        '/master-data/rek-jenis',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar RekJenis setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRekJenis'] })
    },
    onError: (err) => {
      return err
    },
  })
}
