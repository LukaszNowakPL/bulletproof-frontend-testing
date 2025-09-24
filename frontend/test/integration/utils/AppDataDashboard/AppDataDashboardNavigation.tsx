import React from 'react';
import {useNavigate} from 'react-router';
import {goToDashboardButtonTestId} from './const';

interface AppDataDashboardProps {
    addGoToDashboardButton?: boolean;
    dashboardUrl?: string;
}

/**
 * This component renders a button navigating to the App data dashboard.
 *
 * Rendering such a component is not obligatory. For example, if a tested journey alters state value and navigates to a certain url, the App data dashboard might get exposed under expected url.
 * At the end of a journey the dashboard will get printed and state data will be displayed to the test screen.
 */
export const AppDataDashboardNavigation: React.FC<AppDataDashboardProps> = ({dashboardUrl, addGoToDashboardButton}) => {
    const navigate = useNavigate();
    return (
        <>
            {addGoToDashboardButton && (
                <button data-test-id={goToDashboardButtonTestId} onClick={() => navigate(dashboardUrl || '')}>
                    go to app data dashboard
                </button>
            )}
        </>
    );
};
