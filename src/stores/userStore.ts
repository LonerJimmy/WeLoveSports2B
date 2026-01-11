import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo, CompleteUserInfo } from '@/types'
import { getUserInfo as getUserInfoApi } from '@/api'

interface UserState {
  token: string | null
  userInfo: CompleteUserInfo | null
  isAuthenticated: boolean
  isCoach: boolean
  hasHydrated: boolean

  // Actions
  setToken: (token: string) => void
  setUserInfo: (userInfo: CompleteUserInfo) => void
  login: (token: string) => void
  logout: () => void
  getUserInfo: () => Promise<void>
  setHasHydrated: (state: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      userInfo: null,
      isAuthenticated: false,
      isCoach: false,
      hasHydrated: false,

      setToken: (token: string) => {
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
        set({ token, isAuthenticated: true })
      },

      logout: () => {
        set({
          token: null,
          userInfo: null,
          isAuthenticated: false,
          isCoach: false,
        })
      },

      setHasHydrated: (state: boolean) => {
        set({
          hasHydrated: state
        })
      },

      getUserInfo: async () => {
        try {
          const res = await getUserInfoApi()
          if (res.data.success && res.data.data) {
            set({
              userInfo: res.data.data,
              isAuthenticated: true,
              isCoach: res.data.data.isCoach || false,
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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
