import React from 'react';
import {Grid} from '@radix-ui/themes';
import {AppLogo} from './AppLogo';
import {AppMenu} from './AppMenu';
import * as styles from './AppHeader.styles';
import {DarkModeToggle} from './DarkModeToggle';

export const AppHeader: React.FC = () => {
    return (
        <header className={styles.headerContainer}>
            <Grid columns={'3'}>
                <AppLogo />
                <AppMenu />
                <DarkModeToggle />
            </Grid>
        </header>
    );
};
