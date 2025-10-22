import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesOperator } from './types'

interface CreateAksesOperatorPayload {
  id_operator: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostAksesOperator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAksesOperatorPayload
    ): Promise<AksesOperator> => {
      const { data } = await api.post<AksesOperator>(
        '/hak-akses/akses-operator',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesOperator'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
