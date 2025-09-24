import React from 'react';
import {AppHeader} from '../AppHeader/AppHeader';
import {Container} from '@radix-ui/themes';
import {AppFooter} from '../AppFooter/AppFooter';
import {Notifications} from '../Notifications/Notifications';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({children}) => {
    return (
        <>
            <Container size={'4'}>
                <AppHeader />
                <main>{children}</main>
                <AppFooter />
                <Notifications />
            </Container>
        </>
    );
};
