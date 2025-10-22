import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UsersRole } from './types'

interface UpdateUsersRolePayload {
  id?: string
  rule: string
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutUsersRole() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateUsersRolePayload): Promise<UsersRole> => {
      const { data } = await api.put<UsersRole>(
        `/hak-akses/users-role/${payload.id}`,
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['useGetUserRole'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
