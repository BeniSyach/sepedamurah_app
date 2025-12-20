import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { RefPajakBendaharaPaginatedResponse } from './types'

interface UpdatePajakBendaharaPayload {
  id?: string
  nm_pajak_bendahara: string
}

/**
 * Hook untuk mengupdate data DPA (PUT)
 */
export function usePutRefPajakBendahara() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdatePajakBendaharaPayload
    ): Promise<RefPajakBendaharaPaginatedResponse> => {
      const { data } = await api.put<RefPajakBendaharaPaginatedResponse>(
        `/master-data/ref-pajak-bendahara/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar DPA setelah update
      queryClient.invalidateQueries({ queryKey: ['useGetRefPajakBendahara'] })
    },
    onError: (err) => {
      return err
    },
  })
}
