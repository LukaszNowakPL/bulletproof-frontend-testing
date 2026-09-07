import {page, userEvent} from 'vitest/browser';
import {dashboardTestId, goToDashboardButtonTestId} from './const';
import {AppDataValues} from '../../../../src/context/AppDataContext/AppDataContext';
import {expect} from 'vitest';

/**
 * Asserts current value of state management printed on the App data dashboard.
 */
export const assertAppDataValue = async (item: keyof AppDataValues, expectedValue: string | number | boolean | null) => {
    const dashboard = page.getByTestId(dashboardTestId);
    expect(dashboard).toBeInTheDocument();

    dashboard.getByTestId(item);

    await expect.element(dashboard.getByTestId(item)).toHaveTextContent(String(expectedValue));
};

/**
 * Navigating to the App data dashboard by identifying and clicking the AppDataDashboardNavigation component on test screen.
 */
export const clickGoToDashboard = async () => {
    await userEvent.click(page.getByTestId(goToDashboardButtonTestId));
};
