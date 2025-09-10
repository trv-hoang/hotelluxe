import React, { createContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const AdminThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { AdminThemeContext };

interface AdminThemeProviderProps {
    children: React.ReactNode;
}

const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('admin-theme') as Theme;
        return savedTheme || 'light';
    });

    useEffect(() => {
        localStorage.setItem('admin-theme', theme);
        document.documentElement.setAttribute('data-admin-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <AdminThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
};

export default AdminThemeProvider;
