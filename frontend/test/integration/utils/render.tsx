import {QueryClient} from '@tanstack/react-query';
import {render} from '@testing-library/react';
import {ReactQueryContext} from '../../../src/context/ReactQueryContext';
import {createMemoryHistory} from 'history';
import {History} from '@remix-run/router';
import {unstable_HistoryRouter as HistoryRouter, Routes, Route, Outlet} from 'react-router';
import {Theme} from '@radix-ui/themes';
import {Notifications} from '../../../src/components/Notifications/Notifications';
import React from 'react';
import {AppDataProvider, AppDataValues} from '../../../src/context/AppDataContext/AppDataContext';
import {AppDataDashboardNavigation} from './AppDataDashboard/AppDataDashboardNavigation';
import {AppDataDashboard} from './AppDataDashboard/AppDataDashboard';

export interface RenderWithContextsAppDataOptions {
    // Current snapshot of an application state. It has to be of type declared on AppDataContext
    values?: AppDataValues;
    // If true, the test will additionally print button navigating to the app data dashboard
    addGoToDashboardButton?: boolean;
    // Url under which the app data dashboard is available for the test case
    dashboardUrl?: string;
}

interface RenderWithContextsOptions {
    // This should reflect real 'path' argument used on the routing configuration
    routingPath?: string;
    // A browser url we expect this component to be displayed under.
    // It's crucial if routing configuration (and routingPath) use path params, i.e. '/airports/:id'
    browserUrl?: string;
    // Additional configuration related with a State management functionalities
    appData?: RenderWithContextsAppDataOptions;
}

/**
 * This function wraps tested component with React router configuration, Tanstack Query, State management and Radix ui context providers.
 * Such trick includes mentioned libraries inside the integration, requiring less mocks to be performed.
 */
export const renderWithContexts = (component: React.ReactElement, options: RenderWithContextsOptions = {}) => {
    const {routingPath = options.browserUrl || '/', browserUrl = '', appData} = options;

    const history = createMemoryHistory({initialEntries: [browserUrl]});

    /**
     * We must set new query client for each test to avoid queries persisting between test cases.
     * We set retry delay to 0 as default behaviour doesn't bring any value to tests.
     */
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retryDelay: 0,
            },
        },
    });

    /**
     * The history object helps identify if user's action triggered any redirection.
     * Besides that we want the component wrapper to return all 'render()' function values.
     */
    return {
        history,
        ...render(
            <HistoryRouter history={history as unknown as History}>
                <AppDataProvider appData={appData?.values}>
                    <Theme>
                        <ReactQueryContext queryClient={queryClient}>
                            <Routes>
                                <Route
                                    /**
                                     * The Outlet component is going to be exchanged by:
                                     * - 'component' if 'browser' is on routingPath url
                                     * - AppDataDashboard if 'browser' is on appData.dashborddUrl
                                     * - an empty <div /> component if 'browser' is on any other url (i.e. after redirection triggered by user)
                                     */
                                    element={
                                        <>
                                            <Outlet />
                                            <AppDataDashboardNavigation
                                                addGoToDashboardButton={appData?.addGoToDashboardButton}
                                                dashboardUrl={appData?.dashboardUrl}
                                            />
                                        </>
                                    }
                                >
                                    {Boolean(appData?.dashboardUrl) && (
                                        <Route path={appData?.dashboardUrl} element={<AppDataDashboard />} />
                                    )}
                                    <Route path={'*'} element={<div />} />
                                    <Route path={routingPath} element={component} />
                                </Route>
                            </Routes>
                            {/*We must attach this component too, as it functionally displays some data according to AppState value.*/}
                            <Notifications />
                        </ReactQueryContext>
                    </Theme>
                </AppDataProvider>
            </HistoryRouter>,
        ),
    };
};
