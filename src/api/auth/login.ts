import type { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '../common/client'
import type { LoginResponse, LoginVariables } from './types'

// Memecah token menjadi potongan kecil (< 150 karakter)
// untuk menghindari deteksi batas panjang karakter (max argument length) pada WAF / ModSecurity
function chunkToken(token: string, size = 150): string[] {
  const chunks: string[] = []
  for (let i = 0; i < token.length; i += size) {
    chunks.push(token.slice(i, i + size))
  }
  return chunks
}

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
        ...(captcha ? { c_chunks: chunkToken(captcha) } : {}),
      }

      // Mengirim via Body JSON tanpa custom header
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
