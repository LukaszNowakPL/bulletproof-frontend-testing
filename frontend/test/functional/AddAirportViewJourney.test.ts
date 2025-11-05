import {expect} from '@playwright/test';
import {test} from '../playwright/fixtures';
import {Mockiavelli} from 'mockiavelli';
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
    let mockiavelli: Mockiavelli;
    let addAirportPage: AddAirportPage;

    test.beforeEach(async ({page}) => {
        mockiavelli = await Mockiavelli.setup(page);
        addAirportPage = new AddAirportPage(page);
    });

    test.describe('Happy path', () => {
        test('Airport addition journey', async ({page}) => {
            // Given country name
            const countryName = 'test country name';

            // And a country object
            const country = countryFactory.build({name: countryName});

            // And name of a region to select
            const regionName = 'test region to select';

            // And region object
            const region = regionFactory.build({
                name: regionName,
            });

            // And new airport data
            const airport: AirportModel = {
                name: 'test airport name',
                iata: 'TES',
                country_id: country.id,
                regions: [region.id],
                vaccination_notes: 'test vaccination notes',
            };

            // And mocks of api calls triggered during the test
            await countriesMock(page, [country]);
            await regionsMock(page, [region]);
            await airportsMock(page, []);
            const postAirportMock = mockPostAirportsRequest(mockiavelli);

            // When I go to Add airport page
            await goTo(page, '/airports/add');

            // Then I'm ready to start the journey
            await addAirportPage.assertReady();

            // When I fulfill and send the form
            await addAirportPage.fillNameField(airport.name);
            await addAirportPage.fillIataCodeField(airport.iata);
            await addAirportPage.selectCountry(country.name);
            await addAirportPage.checkRegion(region.name);
            await addAirportPage.fillVaccinationNotesField(airport.vaccination_notes as string);
            await addAirportPage.clickSubmitButton();

            // Then POST api call is resolved with expected body
            const postAirportRequest = await postAirportMock.waitForRequest();
            expect(postAirportRequest.body).toEqual(airport);

            // And addition confirmation is displayed after api call is resolved
            await addAirportPage.assertAdditionConfirmationDisplay();
        });
    });

    test.describe('Negative path', () => {
        test.describe('Tests producing expected 5 console entries', () => {
            test.use({consoleEntriesAmount: 5});
            test('Failing endpoints journey', async ({page}) => {
                // Given country name
                const countryName = 'test country name';

                // And a country object
                const country = countryFactory.build({name: countryName});

                // And name of a region to select
                const regionName = 'test region to select';

                // And region object
                const region = regionFactory.build({
                    name: regionName,
                });

                // And new airport data
                const airport: AirportModel = {
                    name: 'test airport name',
                    iata: 'TES',
                    country_id: country.id,
                    regions: [region.id],
                    vaccination_notes: 'test vaccination notes',
                };

                // And mocks of api calls triggered during the test
                /**
                 * Note: first attempt and three consecutive retries for any GET endpoint must fail in order to display Error component.
                 * Playwright mocking order is bottom up. It means the last mock definition is used. Once it fulfills,
                 * the first above is used instead. This is why failing mock for GET /regions api call is created below successful one.
                 */
                await regionsMock(page, [region]);
                await regionsMock(page, [], 500, 4);
                await countriesMock(page, [country]);
                await airportsMock(page, []);
                const postAirportMock = mockPostAirportsRequest(mockiavelli, 500);

                // When I go to Add airport page
                await goTo(page, '/airports/add');

                // Then I see fetch data error
                await assertFetchDataError(page);

                // When I restart data fetching
                await fetchDataAgain(page);

                // Then I'm ready to add new airport data
                await addAirportPage.assertReady();

                // When I fulfill and send the form
                await addAirportPage.fillNameField(airport.name);
                await addAirportPage.fillIataCodeField(airport.iata);
                await addAirportPage.selectCountry(country.name);
                await addAirportPage.checkRegion(region.name);
                await addAirportPage.fillVaccinationNotesField(airport.vaccination_notes as string);
                await addAirportPage.clickSubmitButton();

                // Then POST api call is called with expected body and rejected
                const postAirportRequest = await postAirportMock.waitForRequest();
                expect(postAirportRequest.body).toEqual(airport);

                // And addition error is displayed after api call is rejected
                await addAirportPage.assertAdditionErrorDisplay();
            });
        });

        test('Form validation', async ({page}) => {
            // Given country name
            const countryName = 'test country name';

            // And a country object
            const country = countryFactory.build({name: countryName});

            // And name of a region to select
            const regionName = 'test region to select';

            // And region object
            const region = regionFactory.build({
                name: regionName,
            });

            // And IATA code of existing airport
            const existingAirportIata = 'AAA';

            // And existing airport object
            const existingAirport = airportFactory.build({iata: existingAirportIata});

            // And new airport data
            const airport: AirportModel = {
                name: 'test airport name',
                iata: 'TES',
                country_id: country.id,
                regions: [region.id],
                vaccination_notes: 'test vaccination notes',
            };

            // And mocks of api calls triggered during the test
            await countriesMock(page, [country]);
            await regionsMock(page, [region]);
            await airportsMock(page, [existingAirport]);

            // When I go to Add airport page
            await goTo(page, '/airports/add');

            // Then I'm ready to add new airport data
            await addAirportPage.assertReady();

            // When I fulfill the form
            await addAirportPage.fillNameField(airport.name);
            await addAirportPage.fillIataCodeField(airport.iata);
            await addAirportPage.selectCountry(country.name);
            await addAirportPage.checkRegion(region.name);
            await addAirportPage.fillVaccinationNotesField(airport.vaccination_notes as string);

            // Then I can't find any errors
            await addAirportPage.assertNoValidationErrors();

            // When I trigger validation error on a name field
            await addAirportPage.triggerNameFieldValidation();

            // Then I can see validation error related with a name field
            await addAirportPage.assertValidationError(/name is required/i);

            // When I add airport name
            await addAirportPage.fillNameField(airport.name);

            // Then I don't see any error anymore
            await addAirportPage.assertNoValidationErrors();

            // When I trigger validation error with empty iata code field
            await addAirportPage.triggerIataCodeFieldValidation();

            // Then I can see validation error related with an empty iata code field
            await addAirportPage.assertValidationError(/airport iata code is required/i);

            // When I trigger validation error with short iata code value
            await addAirportPage.fillIataCodeField('A');

            // Then I can see validation error related with too short iata code value
            await addAirportPage.assertValidationError(/iata code has to be 3 characters/i);

            // When I trigger validation error with non-unique iata code value
            await addAirportPage.clearIataCodeField();
            await addAirportPage.fillIataCodeField(existingAirportIata);

            // Then I can see validation error related with non-unique iata code value
            await addAirportPage.assertValidationError(/airport iata code has to be unique/i);

            // When I add correct airport iata code
            await addAirportPage.clearIataCodeField();
            await addAirportPage.fillIataCodeField(airport.iata);

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
