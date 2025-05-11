import { create } from 'zustand';

// 定义应用状态类型
interface AppState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// 创建应用状态store
export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  
  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));