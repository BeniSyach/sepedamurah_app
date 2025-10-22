import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LogUsersHapus } from './types'

interface CreateLogUsersHapusPayload {
  users_id: string
  deleted_time: string
  deleted_by: string
  alasan: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostLogUsersHapus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: CreateLogUsersHapusPayload
    ): Promise<LogUsersHapus> => {
      const { data } = await api.post<LogUsersHapus>(
        '/history/log-users-hapus',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetLogHapusUsers'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
