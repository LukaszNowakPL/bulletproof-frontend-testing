import {describe, vi} from 'vitest';
import {RouterProvider} from 'react-router';
import {createMemoryRouter, Outlet} from 'react-router';
import {routerDefinition} from '../../../src/components/AppRouter/AppRouter';
import {render, waitFor} from '@testing-library/react';
import {App} from '../../../src/components/App/App';
import {AppError} from '../../../src/components/AppError/AppError';
import {AirportsViewGuard} from '../../../src/views/AirportsView/AirportsView.guard';
import {AirportViewGuard} from '../../../src/views/AirportView/AirportView.guard';
import {AddAirportViewGuard} from '../../../src/views/AddAirportView/AddAirportView.guard';

vi.mock('../../../src/components/App/App');
vi.mock('../../../src/components/AppError/AppError');
vi.mock('../../../src/views/AirportsView/AirportsView.guard');
vi.mock('../../../src/views/AirportView/AirportView.guard');
vi.mock('../../../src/views/AddAirportView/AddAirportView.guard');

/**
 * Helps render applications in router configuration context.
 */
const renderComponent = (entries: string[]) => {
    return render(<RouterProvider router={createMemoryRouter(routerDefinition, {initialEntries: entries, initialIndex: 0})} />);
};

/**
 * The purpose of the testing suite is to assert routing configuration.
 * We don't want to print the entire application, only to check how the url is translated to the view display.
 * That's why all route views are mocked and exchanged by static html representation, which we will assert on tests.
 */
describe('AppRouter', () => {
    beforeEach(() => {
        /**
         * All main components of the application have to be mocked here.
         * You also must remember to import the component and wrap the import url with 'vi.mock()' call, like in the few lines above.
         */

        // Mocking main components
        /**
         * The App component is special, as it attaches all dependency providers, and an application layout.
         * They are redundant from suite perspective, so we can exchange entire component by an Outlet, using the pass-through pattern.
         */
        vi.mocked(App).mockReturnValue(
            <>
                <Outlet />
            </>,
        );
        /**
         * All other components, however, should contain their identification. An Outlet component is created for testing nested paths configuration.
         * If no such route is configured, it's going to be translated to null and not returned on test results.
         */
        vi.mocked(AppError).mockReturnValue(
            <>
                <p>Mocked AppError</p>
                <Outlet />
            </>,
        );

        // Mocking route views
        vi.mocked(AirportsViewGuard).mockReturnValue(
            <>
                <p>Mocked AirportsViewGuard</p>
                <Outlet />
            </>,
        );
        vi.mocked(AirportViewGuard).mockReturnValue(
            <>
                <p>Mocked AirportViewGuard</p>
                <Outlet />
            </>,
        );
        vi.mocked(AddAirportViewGuard).mockReturnValue(
            <>
                <p>Mocked AddAirportViewGuard</p>
                <Outlet />
            </>,
        );
    });

    afterEach(vi.clearAllMocks);

    describe('Route views proper display', () => {
        it('renders only AirportsViewGuard on /airports', async () => {
            // Given browser has expected url set
            const routeConfig = ['/airports'];

            // When component render
            const {container} = renderComponent(routeConfig);

            // Then only expected view is displayed
            await waitFor(() => expect(container.innerHTML).toBe('<p>Mocked AirportsViewGuard</p>'));
        });

        it('renders only AirportViewGuard on /airports/:id', async () => {
            // Given browser has expected url set
            const routeConfig = ['/airports/1'];

            // When component render
            const {container} = renderComponent(routeConfig);

            // Then only expected view is displayed
            await waitFor(() => expect(container.innerHTML).toBe('<p>Mocked AirportViewGuard</p>'));
        });

        it('renders only AddAirportViewGuard on /airports/add', async () => {
            // Given browser has expected url set
            const routeConfig = ['/airports/add'];

            // When component render
            const {container} = renderComponent(routeConfig);

            // Then only expected view is displayed
            await waitFor(() => expect(container.innerHTML).toBe('<p>Mocked AddAirportViewGuard</p>'));
        });
    });

    describe('Automatic redirections', () => {
        it('redirects to /airports on index path', async () => {
            // Given browser has expected url set
            const routeConfig = ['/'];

            // When component render
            const {container} = renderComponent(routeConfig);

            // Then AirportsViewGuard is displayed due to redirection to /airports
            await waitFor(() => expect(container.innerHTML).toBe('<p>Mocked AirportsViewGuard</p>'));
        });

        it('redirects to /airports on any child path', async () => {
            // Given browser has expected url set
            const routeConfig = ['/any-child-path'];

            // When component render
            const {container} = renderComponent(routeConfig);

            // Then AirportsViewGuard is displayed due to redirection to /airports
            await waitFor(() => expect(container.innerHTML).toBe('<p>Mocked AirportsViewGuard</p>'));
        });

        it('redirects to /airports/add on any child path', async () => {
            // Given browser has expected url set
            const routeConfig = ['/airports/add/any-child-path'];

            // When component render
            const {container} = renderComponent(routeConfig);

            // Then AddAirportViewGuard is displayed due to redirection to /airports/add
            await waitFor(() => expect(container.innerHTML).toBe('<p>Mocked AddAirportViewGuard</p>'));
        });
    });

    describe('Errors and edge cases', () => {
        it('renders only AppError if error is thrown', async () => {
            // Given browser has any url
            const routeConfig = ['/any'];

            // And App throws error
            vi.mocked(App).mockImplementation(() => {
                throw new Error('any error');
            });

            // And console error is muted due to expected Error being thrown during the test
            vi.spyOn(console, 'error').mockImplementation(() => {});

            // When component render
            const {container} = renderComponent(routeConfig);

            // Then only AppError is displayed
            await waitFor(() => expect(container.innerHTML).toBe('<p>Mocked AppError</p>'));

            // And console.error is unmuted for following tests
            vi.resetAllMocks();
        });
    });
});
