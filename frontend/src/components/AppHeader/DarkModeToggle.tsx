import React from 'react';
import {useDarkModeContext} from '../../context/AppDataContext/hooks/useDarkModeContext';
import {Flex, Switch, Text} from '@radix-ui/themes';

export const DarkModeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const handleToggleClick = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Text as="label" size="2">
            <Flex gap="2">
                <Switch checked={isDarkMode} onClick={handleToggleClick} />
                Dark mode
            </Flex>
        </Text>
    );
};
