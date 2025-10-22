import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../common/client'
import type { UsersRole } from './types'

interface CreateUsersRolePayload {
  rule: string
}

/**
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostUsersRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUsersRolePayload): Promise<UsersRole> => {
      const { data } = await api.post<UsersRole>(
        '/hak-akses/users-role',
        payload
      )
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['useGetUserRole'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
