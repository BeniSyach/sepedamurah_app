import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { LogUsersHapus } from './types'

interface UpdateLogUsersHapusPayload {
  log_id: string
  users_id: string
  deleted_time: string
  deleted_by: string
  alasan: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutLogUsersHapus() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (
      payload: UpdateLogUsersHapusPayload
    ): Promise<LogUsersHapus> => {
      const { data } = await api.put<LogUsersHapus>(
        `/history/log-users-hapus/${payload.log_id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetLogHapusUsers'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
