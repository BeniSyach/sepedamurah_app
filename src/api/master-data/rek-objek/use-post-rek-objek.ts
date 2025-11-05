import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekObjek } from './types'

interface CreateRekObjekPayload {
  kd_objek1: string
  kd_objek2: string
  kd_objek3: string
  kd_objek4: string
  nm_rek_objek: string
}

/**
 * Hook untuk membuat data RekObjek baru (POST)
 */
export function usePostRefRekObjek() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRekObjekPayload): Promise<RekObjek> => {
      const { data } = await api.post<RekObjek>(
        '/master-data/rek-objek',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar RekObjek setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRekObjek'] })
    },
    onError: (err) => {
      return err
    },
  })
}
