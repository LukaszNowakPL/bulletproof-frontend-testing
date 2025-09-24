import {AppDataContext} from '../AppDataContext';
import {useCallback, useContext} from 'react';
import {setIsDarkMode} from '../actions/DarkModeActions';

export const useDarkModeContext = () => {
    const [{isDarkMode}, dispatch] = useContext(AppDataContext);

    return [isDarkMode, useCallback((isDarkMode: boolean) => dispatch(setIsDarkMode(isDarkMode)), [dispatch])] as const;
};
