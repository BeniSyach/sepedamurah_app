import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { AksesKuasaBud } from './types'

interface CreateAksesKuasaBudPayload {
  id_kbud: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostAksesKuasaBud() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateAksesKuasaBudPayload
    ): Promise<AksesKuasaBud> => {
      const { data } = await api.post<AksesKuasaBud>(
        '/hak-akses/akses-kuasa-bud',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetAksesKuasaBUD'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
