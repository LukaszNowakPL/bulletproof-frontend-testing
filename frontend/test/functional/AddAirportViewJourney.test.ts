import {expect} from '@playwright/test';
import {test} from '../playwright/fixtures';
import {PayloadCall} from '../playwright/api-mocks/utils/PayloadCall';
import {AddAirportPage} from './pages/AddAirportPage';
import {AirportModel} from '../../src/api/rest/airports.dto';
import {countriesMock} from '../playwright/api-mocks/countries';
import {regionsMock} from '../playwright/api-mocks/regions';
import {airportsMock, mockPostAirportsRequest} from '../playwright/api-mocks/airports';
import {fetchDataAgain, goTo} from '../playwright/navigation';
import {assertFetchDataError} from '../playwright/assertions';
import {airportFactory} from '../utils/factories/airports';
import {countryFactory} from '../utils/factories/countries';
import {regionFactory} from '../utils/factories/regions';

test.describe('Add airport journey', () => {
    let payloadCall: PayloadCall;
    let addAirportPage: AddAirportPage;

    test.beforeEach(async ({page}) => {
        payloadCall = new PayloadCall(page);
        addAirportPage = new AddAirportPage(page);
    });

    test.describe('Happy path', () => {
        test('Airport addition journey', async ({page}) => {
            /**
             * Data parts like countries, regions etc. are set repeatedly on each test case. This naturally tempts to creating a dedicated helper returning data set for all cases.
             * From my experience, however, creating such a helper ends up with additional complication and maintenance costs in the future. It also usually ends up with returning data we simply don't need for given test case.
             * As long as we already use a factory pattern, I rather recommend creating data necessary for the test directly in the case's body. By the small cost of repetition we get data visibility and direct usage.
             */
            const country = countryFactory.build({name: 'test country name'});
            const region = regionFactory.build({
                name: 'test region to select',
            });
            const newAirport: AirportModel = {
                name: 'test airport name',
                iata: 'TES',
                country_id: country.id,
                regions: [region.id],
                vaccination_notes: 'test vaccination notes',
            };
            // Note: Only mocks of calls triggered during test scenario are set
            await countriesMock(page, [country]);
            await regionsMock(page, [region]);
            await airportsMock(page, []);
            const postAirportMock = await mockPostAirportsRequest(payloadCall);

            // Given application being ready for data insertion
            await goTo(page, '/airports/add');
            await addAirportPage.assertReady();

            // When I fulfill and send the form
            await addAirportPage.fillNameField(newAirport.name);
            await addAirportPage.fillIataCodeField(newAirport.iata);
            await addAirportPage.selectCountry(country.name);
            await addAirportPage.checkRegion(region.name);
            await addAirportPage.fillVaccinationNotesField(newAirport.vaccination_notes!);
            await addAirportPage.clickSubmitButton();

            // Then POST api call is resolved with expected body
            expect(await postAirportMock.getRequestBody()).toEqual(newAirport);

            // And addition confirmation is displayed after api call is resolved
            await addAirportPage.assertAdditionConfirmationDisplay();
        });
    });

    test.describe('Negative path', () => {
        test.describe('Tests producing expected 5 console entries', () => {
            test.use({consoleEntriesAmount: 5});
            test('Failing endpoints journey', async ({page}) => {
                const country = countryFactory.build({name: 'test country name'});
                const region = regionFactory.build({
                    name: 'test region to select',
                });
                const newAirport: AirportModel = {
                    name: 'test airport name',
                    iata: 'TES',
                    country_id: country.id,
                    regions: [region.id],
                    vaccination_notes: 'test vaccination notes',
                };
                /**
                 * Note: first attempt and three consecutive retries for any GET endpoint must fail in order to display Error component.
                 * Playwright mocking order is bottom up. It means the last mock definition is used. Once it fulfills,
                 * the first above is used instead. This is why failing mock for GET /regions api call is created below successful one.
                 */
                await regionsMock(page, [region]);
                await regionsMock(page, [], 500, 4);
                await countriesMock(page, [country]);
                await airportsMock(page, []);
                const postAirportMock = await mockPostAirportsRequest(payloadCall, 500);

                // When I go to Add airport page
                await goTo(page, '/airports/add');

                // Then I see fetch data error because of regions endpoint responding with 500 status initially
                await assertFetchDataError(page);

                // When I restart data fetching
                await fetchDataAgain(page);

                // Then I'm ready to add new airport data
                await addAirportPage.assertReady();

                // When I fulfill and send the form
                await addAirportPage.fillNameField(newAirport.name);
                await addAirportPage.fillIataCodeField(newAirport.iata);
                await addAirportPage.selectCountry(country.name);
                await addAirportPage.checkRegion(region.name);
                await addAirportPage.fillVaccinationNotesField(newAirport.vaccination_notes!);
                await addAirportPage.clickSubmitButton();

                // Then POST api call is called with expected body and rejected
                expect(await postAirportMock.getRequestBody()).toEqual(newAirport);

                // And addition error is displayed after api call is rejected
                await addAirportPage.assertAdditionErrorDisplay();
            });
        });

        test('Form validation', async ({page}) => {
            const country = countryFactory.build({name: 'test country name'});
            const region = regionFactory.build({
                name: 'test region to select',
            });
            const existingAirport = airportFactory.build({iata: 'AAA'});
            const newAirport: AirportModel = {
                name: 'test airport name',
                iata: 'TES',
                country_id: country.id,
                regions: [region.id],
                vaccination_notes: 'test vaccination notes',
            };
            await countriesMock(page, [country]);
            await regionsMock(page, [region]);
            await airportsMock(page, [existingAirport]);

            // Given form being filled with correct data
            await goTo(page, '/airports/add');
            await addAirportPage.assertReady();
            await addAirportPage.fillNameField(newAirport.name);
            await addAirportPage.fillIataCodeField(newAirport.iata);
            await addAirportPage.selectCountry(country.name);
            await addAirportPage.checkRegion(region.name);
            await addAirportPage.fillVaccinationNotesField(newAirport.vaccination_notes!);

            // And no errors being visible
            await addAirportPage.assertNoValidationErrors();

            // When I trigger validation error with empty name field
            await addAirportPage.triggerNameFieldValidation();

            // Then I can see related validation error
            await addAirportPage.assertValidationError(/name is required/i);

            // When I add airport name
            await addAirportPage.fillNameField(newAirport.name);

            // Then I don't see any error anymore
            await addAirportPage.assertNoValidationErrors();

            // When I trigger validation error with empty iata code field
            await addAirportPage.triggerIataCodeFieldValidation();

            // Then I can see related validation error
            await addAirportPage.assertValidationError(/airport iata code is required/i);

            // When I trigger validation error with short iata code value
            await addAirportPage.fillIataCodeField('A');

            // Then I can see related validation error
            await addAirportPage.assertValidationError(/iata code has to be 3 characters/i);

            // When I trigger validation error with non-unique iata code value
            await addAirportPage.clearIataCodeField();
            await addAirportPage.fillIataCodeField(existingAirport.iata);

            // Then I can see related validation error
            await addAirportPage.assertValidationError(/airport iata code has to be unique/i);

            // When I add correct airport iata code
            await addAirportPage.clearIataCodeField();
            await addAirportPage.fillIataCodeField(newAirport.iata);

            // Then I don't see any error anymore
            await addAirportPage.assertNoValidationErrors();

            /**
             * Same process for all remaining fields with validation (country and region).
             */

            /**
             * As we've asserted validation message appearance and disappearance, as well as submit buttons being disabled and enabled back, we can finish the test here.
             */
        });
    });
});
