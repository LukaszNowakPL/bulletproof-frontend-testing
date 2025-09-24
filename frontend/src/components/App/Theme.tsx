import {Theme as RadixTheme} from '@radix-ui/themes';
import {useDarkModeContext} from '../../context/AppDataContext/hooks/useDarkModeContext';

interface ThemeProps {
    children: React.ReactNode;
}

export const Theme: React.FC<ThemeProps> = ({children}) => {
    const [isDarkMode] = useDarkModeContext();
    const appearance = isDarkMode ? 'dark' : 'light';

    return <RadixTheme appearance={appearance}>{children}</RadixTheme>;
};
