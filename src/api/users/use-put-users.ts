import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { Users } from './types'

interface UpdateUsersPayload {
  id?: string
  nik: string
  nip: string
  name: string
  email: string
  no_hp: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  password: string
  image?: string | null
  is_active?: boolean | string
  visualisasi_tte?: string | null
  chat_id?: string | null
}

/**
 * Hook untuk mengupdate data urusan (PUT)
 */
export function usePutUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn menerima payload dan id
    mutationFn: async (payload: UpdateUsersPayload): Promise<Users> => {
      const { data } = await api.put<Users>(`/users/${payload.id}`, payload)
      return data
    },
    onSuccess: () => {
      // Refresh cache daftar urusan setelah update
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
