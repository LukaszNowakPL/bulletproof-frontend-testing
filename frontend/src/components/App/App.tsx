import {QueryClient} from '@tanstack/react-query';
import {Outlet, ScrollRestoration} from 'react-router-dom';
import {ReactQueryContext} from '../../context/ReactQueryContext';
import {AppLayout} from './AppLayout';
import {AppDataProvider} from '../../context/AppDataContext/AppDataContext';
import {Theme} from './Theme';

interface AppProps {
    queryClient: QueryClient;
}

export const App: React.FC<AppProps> = ({queryClient}) => {
    return (
        <AppDataProvider>
            <Theme>
                <ReactQueryContext queryClient={queryClient}>
                    <AppLayout>
                        <Outlet />
                        <ScrollRestoration />
                    </AppLayout>
                </ReactQueryContext>
            </Theme>
        </AppDataProvider>
    );
};
