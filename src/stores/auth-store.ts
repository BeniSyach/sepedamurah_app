import type { LoginResponse, User } from '@/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'access_token'

interface AuthState {
  user: User | null
  accessToken: string
  setUser: (user: User | null) => void
  setAccessToken: (token: string) => void
  login: (data: LoginResponse) => void
  resetAccessToken: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      // Initialize token from cookie
      let initToken = ''
      try {
        const cookieState = getCookie(ACCESS_TOKEN)
        initToken = cookieState ? JSON.parse(cookieState) : ''
      } catch {
        initToken = ''
        removeCookie(ACCESS_TOKEN)
      }

      return {
        user: null,
        accessToken: initToken,

        setUser: (user) => set({ user }),

        setAccessToken: (token) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(token))
          set({ accessToken: token })
        },

        login: (data: LoginResponse) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(data.token))
          set({
            user: data.user,
            accessToken: data.token,
          })
        },

        resetAccessToken: () => {
          removeCookie(ACCESS_TOKEN)
          set({ accessToken: '' })
        },

        reset: () => {
          removeCookie(ACCESS_TOKEN)
          set({
            user: null,
            accessToken: '',
          })
        },
      }
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
)
