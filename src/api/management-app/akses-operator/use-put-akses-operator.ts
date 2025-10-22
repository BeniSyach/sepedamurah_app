import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesOperator } from './types'

interface UpdateAksesOperatorPayload {
  id?: string
  id_operator: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutAksesOperator() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateAksesOperatorPayload
    ): Promise<AksesOperator> => {
      const { data } = await api.put<AksesOperator>(
        `/hak-akses/akses-operator/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesOperator'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
