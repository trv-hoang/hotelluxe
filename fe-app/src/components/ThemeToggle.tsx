import { useThemeStore } from '@/store/useThemeStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useThemeStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition'>
                    {theme === 'dark' ? (
                        <>
                            <Moon className='w-4 h-4' />
                            Dark
                        </>
                    ) : theme === 'system' ? (
                        <>
                            <Laptop className='w-4 h-4' />
                            System
                        </>
                    ) : (
                        <>
                            <Sun className='w-4 h-4' />
                            Light
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-32'>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className='mr-2 h-4 w-4' />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className='mr-2 h-4 w-4' />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Laptop className='mr-2 h-4 w-4' />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
