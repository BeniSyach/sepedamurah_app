import type { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '../common/client'
import type { LoginResponse, LoginVariables } from './types'

export function useLogin() {
  const login = useAuthStore((s) => s.login)

  return useMutation<
    LoginResponse,
    AxiosError<{ error: string }>,
    LoginVariables
  >({
    mutationFn: async (variables) => {
      const { captcha, ...body } = variables
      const { data } = await api.post<LoginResponse>('/login', body, {
        headers: captcha ? { 'X-Recaptcha-Token': captcha } : {},
      })
      return data
    },
    onSuccess: (data) => {
      login(data)
    },
    onError: (err) => {
      return err
    },
  })
}
