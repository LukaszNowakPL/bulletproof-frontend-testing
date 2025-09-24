import {userEvent} from '@testing-library/user-event';
import {screen, within} from '@testing-library/react';
import {dashboardTestId, goToDashboardButtonTestId} from './const';
import {AppDataValues} from '../../../../src/context/AppDataContext/AppDataContext';

/**
 * Asserts current value of state management printed on the App data dashboard.
 */
export const assertAppDataValue = async (item: keyof AppDataValues, expectedValue: string | number | boolean | null) => {
    const dashboard = await screen.findByTestId(dashboardTestId);
    expect(dashboard).toBeInTheDocument();

    expect(within(dashboard).getByTestId(item).textContent).toBe(String(expectedValue));
};

/**
 * Navigating to the App data dashboard by identifying and clicking the AppDataDashboardNavigation component on test screen.
 */
export const clickGoToDashboard = async () => {
    await userEvent.click(screen.getByTestId(goToDashboardButtonTestId));
};
