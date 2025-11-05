import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekAkun } from './types'

interface CreateRekAkunPayload {
  kode: string
  nm_level_rek: string
}

/**
 * Hook untuk membuat data RekAkun baru (POST)
 */
export function usePostRefRekAkun() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRekAkunPayload): Promise<RekAkun> => {
      const { data } = await api.post<RekAkun>('/master-data/rek-akun', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar RekAkun setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRekAkun'] })
    },
    onError: (err) => {
      return err
    },
  })
}
