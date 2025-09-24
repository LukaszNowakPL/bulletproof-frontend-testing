import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import {describe, vi} from 'vitest';
import {renderWithContexts} from '../utils/render';
import {server} from '../mocks/server';
import {addAirportHandler, airportsHandler} from '../api-handlers/airports';
import {AirportModel} from '../../../src/api/rest/airports.dto';
import {countriesHandler} from '../api-handlers/countries';
import {regionsHandler} from '../api-handlers/regions';
import {AddAirportViewGuard} from '../../../src/views/AddAirportView/AddAirportView.guard';
import {userEvent} from '@testing-library/user-event';
import {countryFactory} from '../../utils/factories/countries';
import {regionFactory} from '../../utils/factories/regions';
import {airportFactory} from '../../utils/factories/airports';

/**
 * Here we test all functionalities of AddAirportView guard and its subcomponents.
 *
 * Thanks to such an approach, technological implementation of the view is transparent to tests.
 * So you can refactor the view pretty anyway you want. As long as it won't alter the functionality, tests will pass.
 *
 * Tests of a small portion of the view should also be attached here. This is for scenarios like filtering regions using a dedicated field.
 * If you decide to reshape or rename tested components in the future, you won't need to change test scenarios. Such an additional complication is worth it for simplicity's sake.
 */
describe('AddAirportView.guard', () => {
    /**
     * Happy path is a group of tests ending up with a functional success.
     *
     * The success depends on the functional purpose of the view. From this view's perspective, it's all the way from entering the page to confirming an airport creation.
     * Please refer to tests of AirportsView.guard to see other types of a happy path use cases.
     *
     * It's good to assert any middle-states here too, i.e. if the loading indicator is displayed during Get api calls, or fields and submit button are disabled during Post api call.
     *
     * You may consider asserting some crucial texts being displayed, however it may become redundant if you create a visual regression testing suite too.
     *
     * There is no need to check if countries or regions fetched from the backend are available on the page. We are going to use them during the test, which becomes an assertion in itself.
     */
    describe('Happy path', () => {
        /**
         * This is a prime happy path scenario.
         *
         * You may consider creating separate scenarios - the one with all fields being fulfilled, and the basic one with only required fields being sent.
         * This is for better assertion of minimum contract agreement and confirming how additional fields are translated into the Post request body.
         */
        it('renders component and adds airport', async () => {
            /**
             * Required by radix-ui components used on tested view.
             */
            window.HTMLElement.prototype.scrollIntoView = vi.fn();
            window.HTMLElement.prototype.hasPointerCapture = vi.fn();

            /**
             * Right now we set the scene for future testing.
             * Any piece of data used during the scenario (i.e. typed into field or sent through the api call) should get set here. Anything else should get randomized.
             * Please note the Gherkin notation used. It really helps understanding what happens during the scenario.
             * Don't hesitate to note why such a piece of data is created or why some action is taken by a user.
             */

            /**
             * This country name is going to be used during the test. It might be randomized, however, it's more convenient to operate on some constant values.
             *
             * Note the name used, which clearly states what piece of information it is and that it is used for testing purposes.
             */
            // Given country name
            const countryName = 'test country name';

            /**
             * Right now we build other pieces of data based on the ones set before.
             *
             * The country object is going to be used as a response of a Get api call, as well as part of the Post request body.
             * Id of a country is randomized. That's ok, as we will use it rather for asserting integration points than displaying on the screen.
             */
            // And a country object
            const country = countryFactory.build({name: countryName});

            // And name of a region to select
            const regionName = 'test region to select';

            // And region object
            const region = regionFactory.build({
                name: regionName,
            });

            /**
             * This object is going to be a Post request body.
             * It has to be of the type of object model sent to the backend. If type alters during application development, we will find easily which tests have to be refactored too.
             *
             * It's a matter of personal preference if you want to set some pieces of data beforehand, or directly on the model. This is for items like airport name or an IATA code, which we will use later on tests.
             * The crucial thing is that all data used during the test has to be aligned. This is because the Post request body reflects all previous actions taken by the user during the test.
             */
            // And new airport data
            const airport: AirportModel = {
                name: 'test airport name',
                iata: 'TES',
                country_id: country.id,
                regions: [region.id],
                vaccination_notes: 'test vaccination notes',
            };

            /**
             * Here we set mocks for all api calls expected to be triggered during the test case. We must be very strict here as it is one of the most crucial parts of the integration suite.
             *
             * We must handle only api calls we expect to be triggered, with accuracy down to a single path param, search query item, piece of a request body or header - depending on an endpoint shape.
             * If the shape of a Post request body changed on the application, the MSW library will not handle such a call, making tests fail. You will find more details by inspecting each endpoint's handler.
             *
             * Note the fact of passing data to be used by api calls as handler's argument. Such an approach shifts ownership of such a data creation to the test scenario.
             * It's good pattern, as the test scenario should be aware of data it operates on. As stated previously, it is a mixture of hardcoded and randomized data (if it's not relevant for such a test case).
             */
            // And mocks of api calls triggered during the test
            server.use(countriesHandler([country]), regionsHandler([region]), airportsHandler([]), addAirportHandler(airport));

            /**
             * Now we pass the tested view to the component wrapper, which takes care of rendering within the context of high level integrations.
             * Some additional params are usually required for wrapper configuration.
             */
            // When component render
            const {history} = renderWithContexts(<AddAirportViewGuard />, {routingPath: '/airports/add', browserUrl: '/airports/add'});

            /**
             * Loading indicator display is a crucial UX functionality, so we can assert it here.
             * Such assertions on other test cases are then redundant.
             *
             * Here we also assert an accessible label attached to the loading indicator.
             *
             * Note RegExp being used to identify an element by its name.
             * Some design systems require certain elements (i.e. buttons or headers) to be visually uppercase. Using uppercase labels is considered a bad pattern when it comes to accessibility. That's why it's handled by css layer, while the real label is usually a UCfirst format.
             * The RegExp trick makes such a differentiation transparent for the test case. It has an almost unnoticed impact on test performance (2-3%) which is a fair tradeoff for simplicity's sake.
             */
            // Then loading indicator is displayed
            expect(await screen.findByRole('progressbar', {name: /fetching data/i})).toBeInTheDocument();

            /**
             * We've connected the 'progressbar' element with its accessible label on a previous check.
             * There is no need to connect them anymore, so we can simply use a single 'progressbar' here.
             */
            // When loading indicator disappears
            await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

            // Then page header is visible
            expect(await screen.findByRole('heading', {name: /add airport/i, level: 1})).toBeInTheDocument();

            /**
             * We know the tested view is in the expected state now, so we can perform user actions, using data defined beforehand.
             */
            // When user fulfill entire form
            await userEvent.type(screen.getByRole('textbox', {name: /name/i}), airport.name);
            await userEvent.type(screen.getByRole('textbox', {name: /iata code/i}), airport.iata);
            await userEvent.click(screen.getByRole('combobox', {name: /country/i}));
            await userEvent.click(screen.getByRole('option', {name: country.name}));
            await userEvent.click(screen.getByRole('checkbox', {name: region.name}));
            await userEvent.type(screen.getByRole('textbox', {name: /vaccination notes/i}), airport.vaccination_notes as string);

            // And send the data to the backend
            await userEvent.click(screen.getByRole('button', {name: /submit/i}));

            // Then all form elements are disabled during api call
            const disabledElements = [
                ...screen.getAllByRole('textbox'),
                ...screen.getAllByRole('combobox'),
                ...screen.getAllByRole('checkbox'),
                ...screen.getAllByRole('button'),
            ];
            for (let i in disabledElements) {
                expect(disabledElements[i]).toBeDisabled();
            }

            // And addition confirmation is displayed after api call is resolved
            const confirmationMessage = await screen.findByRole('status');
            expect(confirmationMessage).toBeInTheDocument();
            expect(confirmationMessage).toHaveTextContent(/airport added successfully/i);

            // And client is redirected to /airports page
            expect(history.location.pathname).toEqual('/airports');
        });
    });

    /**
     * Negative path is a group of tests without functional success.
     *
     * They follow the happy path scenario up to the point where some circumstance becomes a major blocker. They are usually failing api endpoints or users providing non-valid data. We don't want to fix them. Just assert an outcome and finish the case.
     *
     * There is no need for performing middle-state checks - i.e. if a loading indicator is displayed. If they are not strictly related to the case, they have been confirmed on a happy path scenario already.
     *
     * It is recommended to create cases in order of blocker's appearance during view's lifetime.
     */
    describe('Negative path', () => {
        /**
         * The first possible blocker for functional success is when any Get api call returns an error for any reason.
         * This could be anything on a real world - a backend service being down, lack of authorization or internet connection problems. From the front-end application's perspective it is an endpoint responding with 4XX or 5XX class responses.
         * As the behavior is the same for any endpoint, we can use 'each' grouping pattern here.
         */
        it.each<string>(['airports', 'countries', 'regions'])(
            'displays connectivity error on GET: /%s api call failure',
            async (failingEndpoint) => {
                /**
                 * All endpoints may return empty arrays. We won't use them on tests, because we want Error message to be displayed.
                 */
                // Given mocks of api calls triggered during the test with only one responding with error
                server.use(
                    airportsHandler([], failingEndpoint !== 'airports' ? 200 : 500),
                    countriesHandler([], failingEndpoint !== 'countries' ? 200 : 500),
                    regionsHandler([], failingEndpoint !== 'regions' ? 200 : 500),
                );

                // When component render
                renderWithContexts(<AddAirportViewGuard />, {routingPath: '/airports/add', browserUrl: '/airports/add'});

                /**
                 * We have skipped the check of a loading indicator appearance here, as it's asserted on happy path tests.
                 */

                // Then error message is displayed
                const alert = await screen.findByRole('alert');
                expect(alert).toBeInTheDocument();
                expect(alert).toHaveTextContent(/sorry, there is some connectivity error/i);
                const restartButton = await screen.findByRole('button', {name: /restart data fetching/i});
                expect(restartButton).toBeInTheDocument();

                /**
                 * Now we want to assert that clicking on a button fetches the data again, which will be confirmed by displaying a loading indicator instead of an Error message.
                 */

                // When user click restart button
                await userEvent.click(restartButton);

                // Then loading indicator appears
                expect(await screen.findByRole('progressbar', {name: /fetching data/i})).toBeInTheDocument();

                // And error message disappears
                expect(screen.queryByRole('alert')).not.toBeInTheDocument();

                // When loading indicator disappears
                await waitForElementToBeRemoved(screen.queryByRole('progressbar'));

                // Then error message is displayed back after another api call failure
                const secondAlert = await screen.findByRole('alert');
                expect(secondAlert).toBeInTheDocument();
                expect(secondAlert).toHaveTextContent(/sorry, there is some connectivity error/i);
            },
        );

        /**
         * The second possible blocker in the tested view's lifetime is when the user provides invalid data.
         *
         * Such a case is usually complicated. We must assert that the validation error is not displayed initially.
         * Then we must provide all valid data, so the Submit button is enabled.
         * Then for each field respectively we must provide non-valid data, assert validation error appearance and Submit button disability.
         * Then we must provide valid data back and assert validation error disappearance as well as the Submit button being enabled.
         */
        it('renders validation errors', async () => {
            /**
             * Required by radix-ui components used on tested view.
             */
            window.HTMLElement.prototype.scrollIntoView = vi.fn();
            window.HTMLElement.prototype.hasPointerCapture = vi.fn();

            /**
             * We must set the scene as it was a happy path scenario, up to the Post api endpoint mock.
             */
            // Given country object
            const country = countryFactory.build({name: 'test country name'});

            // And region object
            const region = regionFactory.build({
                name: 'test region to select',
            });

            // And IATA code of existing airport
            const existingAirportIata = 'AAA';

            // And airport object
            const existingAirport = airportFactory.build({iata: existingAirportIata});

            // And IATA code of new airport (must be different from existing ones)
            const airportIata = 'BBB';

            /**
             * This object will not be sent as a body of a Post api call, however its structure is helpful with fulfilling the form.
             */
            // And new airport data
            const airport: AirportModel = {
                name: 'test airport name',
                iata: airportIata,
                country_id: country.id,
                regions: [region.id],
                vaccination_notes: 'test vaccination notes',
            };

            // And mocks of all Get api calls triggered during the test
            server.use(countriesHandler([country]), regionsHandler([region]), airportsHandler([existingAirport]));

            // When component render
            renderWithContexts(<AddAirportViewGuard />, {routingPath: '/airports/add', browserUrl: '/airports/add'});

            // Then page header is visible
            expect(await screen.findByRole('heading', {name: /add airport/i, level: 1})).toBeInTheDocument();

            // And validation errors are not available
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();

            // And submit button is disabled
            const submitButton = screen.getByRole('button', {name: /submit/i});
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toBeDisabled();

            const nameField = screen.getByRole('textbox', {name: /name/i});
            const iataField = screen.getByRole('textbox', {name: /iata code/i});

            // When user fulfill the entire form
            await userEvent.type(nameField, airport.name);
            await userEvent.type(iataField, airport.iata);
            await userEvent.click(screen.getByRole('combobox', {name: /country/i}));
            await userEvent.click(screen.getByRole('option', {name: country.name}));
            await userEvent.click(screen.getByRole('checkbox', {name: region.name}));
            await userEvent.type(screen.getByRole('textbox', {name: /vaccination notes/i}), airport.vaccination_notes as string);

            // Then validation errors are not available
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();

            // And submit button is enabled
            expect(submitButton).toBeEnabled();

            /**
             * Now we trigger validation errors field-by-field, depending on validation logic.
             */

            // When user clear the name input
            await userEvent.clear(nameField);

            // Then validation message is displayed
            const nameError = screen.getByRole('alert');
            expect(nameError).toBeInTheDocument();
            expect(nameError).toHaveTextContent(/airport name is required/i);

            // And submit button is disabled
            expect(submitButton).toBeDisabled();

            // When user provides a valid value back
            await userEvent.type(nameField, airport.name);

            // Then validation message disappears
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();

            // And submit button is enabled
            expect(submitButton).toBeEnabled();

            // When user clear the IATA input
            await userEvent.clear(iataField);

            // Then validation message is displayed
            const iataError = screen.getByRole('alert');
            expect(iataError).toBeInTheDocument();
            expect(iataError).toHaveTextContent(/airport iata code is required/i);

            // And submit button is disabled
            expect(submitButton).toBeDisabled();

            // When user provides IATA code of insufficient length
            await userEvent.type(iataField, 'A');

            // Then proper validation message is displayed
            expect(iataError).toHaveTextContent(/iata code has to be 3 characters/i);

            // And submit button is disabled
            expect(submitButton).toBeDisabled();

            // When user clear the IATA input
            await userEvent.clear(iataField);

            // And provide IATA code which already exists
            await userEvent.type(iataField, existingAirportIata);

            // Then proper validation message is displayed
            expect(iataError).toHaveTextContent(/airport iata code has to be unique/i);

            // And submit button is disabled
            expect(submitButton).toBeDisabled();

            // When user clear the IATA input
            await userEvent.clear(iataField);

            // And provide a valid value back
            await userEvent.type(iataField, airport.iata);

            // Then validation message disappears
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();

            // And submit button is enabled
            expect(submitButton).toBeEnabled();

            /**
             * Same process for all remaining fields with validation (country and region).
             */

            /**
             * As we've asserted validation message appearance and disappearance, as well as submit buttons being disabled and enabled back, we can finish the test here.
             */
        });

        /**
         * The last possible blocker is when the Post api endpoint responds with an error for any reason.
         */
        it('displays error message on Post call api failure', async () => {
            /**
             * The setup and test scenario are almost identical to a Happy path.
             * We only must take care of the Post api responding with error and asserting the proper message is being displayed.
             */

            /**
             * Required by radix-ui components used on tested view.
             */
            window.HTMLElement.prototype.scrollIntoView = vi.fn();
            window.HTMLElement.prototype.hasPointerCapture = vi.fn();

            // Given country object
            const country = countryFactory.build({name: 'test country name'});

            // And region object
            const region = regionFactory.build({
                name: 'test region to select',
            });

            // And new airport data
            const airport: AirportModel = {
                name: 'test airport name',
                iata: 'TES',
                country_id: country.id,
                regions: [region.id],
                vaccination_notes: 'test vaccination notes',
            };

            // And mocks of all api calls triggered during the test
            server.use(
                // Get endpoints
                countriesHandler([country]),
                regionsHandler([region]),
                airportsHandler([]),
                // Post endpoint responding with error
                addAirportHandler(airport, 500),
            );

            // When component render
            renderWithContexts(<AddAirportViewGuard />, {routingPath: '/airports/add', browserUrl: '/airports/add'});

            // Then page header is visible
            expect(await screen.findByRole('heading', {name: /add airport/i, level: 1})).toBeInTheDocument();

            // When user fulfill the entire form with valid data
            await userEvent.type(screen.getByRole('textbox', {name: /name/i}), airport.name);
            await userEvent.type(screen.getByRole('textbox', {name: /iata code/i}), airport.iata);
            await userEvent.click(screen.getByRole('combobox', {name: /country/i}));
            await userEvent.click(screen.getByRole('option', {name: country.name}));
            await userEvent.click(screen.getByRole('checkbox', {name: region.name}));
            await userEvent.type(screen.getByRole('textbox', {name: /vaccination notes/i}), airport.vaccination_notes as string);

            // And send the data to the backend
            await userEvent.click(screen.getByRole('button', {name: /submit/i}));

            // Then error message appears
            const errorMessage = await screen.findByRole('status');
            expect(errorMessage).toBeInTheDocument();
            expect(errorMessage).toHaveTextContent(/error while adding an airport/i);

            // And all form elements are enabled back
            const disabledElements = [
                ...screen.getAllByRole('textbox'),
                ...screen.getAllByRole('combobox'),
                ...screen.getAllByRole('checkbox'),
                ...screen.getAllByRole('button'),
            ];
            for (let i in disabledElements) {
                expect(disabledElements[i]).toBeEnabled();
            }

            // When user send the data to the backend again
            await userEvent.click(screen.getByRole('button', {name: /submit/i}));

            // Then all form elements are disabled again
            for (let i in disabledElements) {
                expect(disabledElements[i]).toBeDisabled();
            }
        });
    });
});
