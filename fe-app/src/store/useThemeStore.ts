import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

type ThemeState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    initTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'system',
    setTheme: (theme) => {
        localStorage.setItem('vite-ui-theme', theme);
        set({ theme });
        // Cập nhật class HTML
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    },
    initTheme: () => {
        const saved =
            (localStorage.getItem('vite-ui-theme') as Theme) || 'system';
        set({ theme: saved });
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (saved === 'system') {
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(saved);
        }
    },
}));
