import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo, CompleteUserInfo } from '@/types'
import { getUserInfo as getUserInfoApi } from '@/api'

interface UserState {
  token: string | null
  userInfo: CompleteUserInfo | null
  isAuthenticated: boolean
  isCoach: boolean

  // Actions
  setToken: (token: string) => void
  setUserInfo: (userInfo: CompleteUserInfo) => void
  login: (token: string) => void
  logout: () => void
  getUserInfo: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      userInfo: null,
      isAuthenticated: false,
      isCoach: false,

      setToken: (token: string) => {
        localStorage.setItem('token', token)
        set({ token })
      },

      setUserInfo: (userInfo: CompleteUserInfo) => {
        set({
          userInfo,
          isAuthenticated: true,
          isCoach: userInfo.isCoach || false,
        })
      },

      login: (token: string) => {
        localStorage.setItem('token', token)
        set({ token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          token: null,
          userInfo: null,
          isAuthenticated: false,
          isCoach: false,
        })
      },

      getUserInfo: async () => {
        try {
          const res = await getUserInfoApi()
          if (res.success && res.data) {
            set({
              userInfo: res.data,
              isAuthenticated: true,
              isCoach: res.data.isCoach || false,
            })
          }
        } catch (error) {
          console.error('Failed to get user info:', error)
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
        isAuthenticated: state.isAuthenticated,
        isCoach: state.isCoach,
      }),
    }
  )
)
