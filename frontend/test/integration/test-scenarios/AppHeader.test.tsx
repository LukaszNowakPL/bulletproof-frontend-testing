import {screen} from '@testing-library/react';
import {describe} from 'vitest';
import {AppHeader} from '../../../src/components/AppHeader/AppHeader';
import {renderWithContexts, RenderWithContextsAppDataOptions} from '../utils/render';
import {userEvent} from '@testing-library/user-event';
import {assertAppDataValue, clickGoToDashboard} from '../utils/AppDataDashboard/helpers';
import {faker} from '@faker-js/faker';

/**
 * Those tests explain the integration with React Context or any other state management system.
 * Asserting impact of state value to a component is relatively easy, like asserting dark mode toggle.
 * Asserting if some action changes the state value is more challenging. This is why we use a dedicated app state dashboard.
 */
describe('AppHeader', () => {
    /**
     * First two cases assert the impact of a state value into the tested component.
     */
    it('renders dark mode toggle being off by default', async () => {
        // When component is rendered with no appData configuration
        renderWithContexts(<AppHeader />);

        // Then dark mode toggle is switched off
        const switcher = screen.getByRole('switch', {name: /dark mode/i});
        expect(switcher).toBeInTheDocument();
        expect(switcher).not.toBeChecked();
    });

    it('renders dark mode toggle being on if dark mode context flag is on', async () => {
        // Given appData with dark mode being on
        const appData = {
            values: {
                isDarkMode: true,
                notifications: [],
            },
        };

        // When component is rendered with appData configuration
        renderWithContexts(<AppHeader />, {appData});

        // Then dark mode toggle is switched on
        const switcher = screen.getByRole('switch');
        expect(switcher).toBeChecked();
    });

    /**
     * This case asserts state value change. The appData dashboard is available for testing under a certain url.
     * Because the tested component doesn't contain a link to the dashboard (it's available exclusively for the test case), we artificially add a button to the tested view.
     * The dashboard contains all state values. The solution exposes a series of helpers, hiding implementation details away and making using it more comfortable.
     */
    it('changes dark mode context flag on switch click', async () => {
        // Given appData with dark mode being on
        const appData: RenderWithContextsAppDataOptions = {
            values: {
                isDarkMode: true,
                notifications: [],
            },
            // Flag for printing a button navigating to the dashboard.
            addGoToDashboardButton: true,
            // And an Url under which the appData dashboard is exposed for a test case.
            dashboardUrl: `/${faker.internet.domainWord()}`,
        };

        // When component is rendered with appData configuration
        renderWithContexts(<AppHeader />, {appData});

        // And user change the dark mode toggle
        await userEvent.click(screen.getByRole('switch'));

        /**
         * We are using a helpers which are tightly coupled with component wrapper configuration.
         */
        // And artificially click on go to dashboard button to read app data values
        await clickGoToDashboard();

        // Then they see dark mode flag is set off in application context
        await assertAppDataValue('isDarkMode', false);
    });
});
