import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesKuasaBud } from './types'

interface UpdateAksesKuasaBudPayload {
  id?: string
  id_kbud: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutAksesKuasaBud() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateAksesKuasaBudPayload
    ): Promise<AksesKuasaBud> => {
      const { data } = await api.put<AksesKuasaBud>(
        `/hak-akses/akses-kuasa-bud/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesKuasaBUD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
