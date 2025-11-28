import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../common/client'
import type { Users } from './types'

export interface UpdateUsersPayload {
  id?: string
  nik?: string
  nip?: string
  name?: string
  email?: string
  no_hp?: string
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
  password?: string
  image?: File | null
  visualisasi_tte?: File | null
  chat_id?: string | null
  is_active?: boolean | string
}

// Union type: bisa FormData atau payload biasa
type UpdateUsersInput = UpdateUsersPayload | FormData

export function usePutUsers() {
  const queryClient = useQueryClient()

  return useMutation<Users, unknown, UpdateUsersInput>({
    mutationFn: async (input) => {
      let payload: FormData

      if (input instanceof FormData) {
        payload = input
      } else {
        payload = new FormData()

        Object.entries(input).forEach(([key, value]) => {
          if (value === undefined || value === null) return

          // === FIX: handle role array ===
          if (Array.isArray(value)) {
            value.forEach((v) => payload.append(`${key}[]`, v))
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            payload.append(key, value as any)
          }
        })
      }

      const id = input instanceof FormData ? payload.get('id') : input.id
      if (!id) throw new Error('ID harus ada')

      const { data } = await api.post<Users>(`/users/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { _method: 'PUT' },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
