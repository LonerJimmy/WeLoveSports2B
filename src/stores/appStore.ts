import { create } from 'zustand'

interface AppState {
  // 全局加载状态
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // 侧边栏折叠状态
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // 当前选中的菜单
  currentMenu: string
  setCurrentMenu: (menu: string) => void

  // Toast 消息
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
  hideToast: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  sidebarCollapsed: false,
  currentMenu: 'dashboard',
  toast: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setCurrentMenu: (menu: string) => set({ currentMenu: menu }),

  showToast: (message, type = 'info') =>
    set({
      toast: { message, type },
    }),

  hideToast: () => set({ toast: null }),
}))
