import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RekObjek } from './types'

interface UpdateLevelRekPayload {
  id: string
  kd_objek1: string
  kd_objek2: string
  kd_objek3: string
  kd_objek4: string
  nm_rek_objek: string
}

/**
 * Hook untuk mengupdate data RekObjek (PUT)
 */
export function usePutRefRekObjek() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateLevelRekPayload): Promise<RekObjek> => {
      const { data } = await api.put<RekObjek>(
        `/master-data/rek-objek/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar RekObjek setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRekObjek'] })
    },
    onError: (err) => {
      return err
    },
  })
}
