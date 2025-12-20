import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefPajakBendaharaPaginatedResponse } from './types'

interface CreatePajakBendaharaPayload {
  nm_pajak_bendahara: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostRefPajakBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreatePajakBendaharaPayload
    ): Promise<RefPajakBendaharaPaginatedResponse> => {
      const { data } = await api.post<RefPajakBendaharaPaginatedResponse>(
        '/master-data/ref-pajak-bendahara',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({ queryKey: ['useGetRefPajakBendahara'] })
    },
    onError: (err) => {
      return err
    },
  })
}
