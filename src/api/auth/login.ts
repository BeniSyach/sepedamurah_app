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
      const payload = {
        ...body,
        ...(captcha ? { captcha_b64: btoa(captcha) } : {}),
      }

      // Mengirim via Body JSON tanpa custom header (mencegah masalah CORS preflight & WAF header filter)
      const { data } = await api.post<LoginResponse>('/login', payload)
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
