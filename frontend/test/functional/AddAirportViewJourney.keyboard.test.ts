import {expect} from '@playwright/test';
import {test} from '../playwright/fixtures';
import {PayloadCall} from '../playwright/api-mocks/utils/PayloadCall';
import {AddAirportPage} from './keyboardNavigationPages/AddAirportPage';
import {AirportModel} from '../../src/api/rest/airports.dto';
import {countriesMock} from '../playwright/api-mocks/countries';
import {regionsMock} from '../playwright/api-mocks/regions';
import {airportsMock, mockPostAirportsRequest} from '../playwright/api-mocks/airports';
import {goTo} from '../playwright/navigation';
import {countryFactory} from "../utils/factories/countries";
import {regionFactory} from "../utils/factories/regions";

test.describe('Add airport journey with keyboard navigation only', () => {
    let payloadCall: PayloadCall;
    let addAirportPage: AddAirportPage;

    test.beforeEach(async ({page}) => {
        payloadCall = new PayloadCall(page);
        addAirportPage = new AddAirportPage(page);
    });

    test('Airport addition journey', async ({page}) => {
        /**
         * This test case focuses on airport addition happy path journey navigating only with keyboards.
         * The aim of such journey is to simulate navigation with assistive technology and asserting order of focusable elements.
         * Such navigation might be difficult to perform on entire pages with rich header section. This is why 'Skip to main content'
         * pattern comes handy and - in fact - is required according to WCAG rules.
         */
        const country = countryFactory.build({name: 'test country name'});
        const regionToSelect = regionFactory.build({
            id: 1,
            name: 'test region to select',
        });
        const regions = [
            regionToSelect,
            regionFactory.build({
                id: 2,
                name: 'test region not to select',
            }),
        ];
        const newAirport: AirportModel = {
            name: 'test airport name',
            iata: 'TES',
            country_id: country.id,
            regions: [regionToSelect.id],
            vaccination_notes: 'test vaccination notes',
        };
        // Note: Only mocks of calls triggered during test scenario are set
        await countriesMock(page, [country]);
        await regionsMock(page, regions);
        await airportsMock(page, []);
        const postAirportMock = await mockPostAirportsRequest(payloadCall);

        // Given application being ready for the journey
        await goTo(page, '/airports/add');
        await addAirportPage.assertReady();

        // When I fulfill and send the form
        await addAirportPage.proceedThroughPage(newAirport, country.name, regionToSelect.name);

        // Then POST api call is resolved with expected body
        expect(await postAirportMock.getRequestBody()).toEqual(newAirport);

        // And addition confirmation is displayed after api call is resolved
        await addAirportPage.assertAdditionConfirmation();
    });
});
