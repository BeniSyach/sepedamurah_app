import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { Users } from './types'

interface CreateUsersPayload {
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
 * Hook untuk membuat data urusan baru (POST)
 */
export function usePostUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUsersPayload): Promise<Users> => {
      const { data } = await api.post<Users>('/users', payload)
      return data
    },
    onSuccess: () => {
      // Refresh daftar urusan setelah berhasil menambah
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
    onError: (err) => {
      return err
    },
  })
}
