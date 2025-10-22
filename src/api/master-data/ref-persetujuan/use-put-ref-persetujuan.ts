import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { Persetujuan } from './types'

interface UpdateuseGetRefPersetujuanPayload {
  id?: string
  konten: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutRefuseGetRefPersetujuan() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateuseGetRefPersetujuanPayload
    ): Promise<Persetujuan> => {
      const { data } = await api.put<Persetujuan>(
        `/master-data/persetujuan/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefPersetujuan'] })
    },
    onError: (err) => {
      return err
    },
  })
}
