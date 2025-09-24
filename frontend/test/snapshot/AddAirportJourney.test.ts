import {Mockiavelli} from 'mockiavelli';
import {test, expect} from '../playwright/fixtures';
import {LIGHTHOUSE_SNAPSHOT_THRESHOLDS} from './utils/const';
import {LighthousePlaywrightFlow} from './utils/Lighthouse/LighthousePlaywrightFlow';
import {TakeLighthouseSnapshot} from './types';
import {CountriesDto} from '../../src/api/rest/countries.dto';
import {RegionDto, RegionsDto} from '../../src/api/rest/regions.dto';
import {AirportModel} from '../../src/api/rest/airports.dto';
import {countriesMock} from '../playwright/api-mocks/countries';
import {regionsMock} from '../playwright/api-mocks/regions';
import {airportsMock, mockPostAirportsRequest} from '../playwright/api-mocks/airports';
import {goTo, setDarkMode} from '../playwright/navigation';
import {AddAirportPage} from './pages/AddAirportPage';
import {assertDarkMode} from '../playwright/assertions';

for (const darkMode of [true, false]) {
    test.describe(`With dark mode being ${darkMode ? 'on' : 'off'}`, () => {
        test.describe('Happy path', () => {
            let mockiavelli: Mockiavelli;
            let addAirportPage: AddAirportPage;

            test.beforeEach(async ({page}, testInfo) => {
                const testSuite = 'Happy path';
                mockiavelli = await Mockiavelli.setup(page);
                addAirportPage = new AddAirportPage(page, testInfo, testSuite, darkMode);
            });

            test('Airport addition', async ({page}, testInfo) => {
                /**
                 * This test focuses on Airport addition happy path journey.
                 */
                test.slow();

                // Given categories and scores to achieve during Lighthouse audit
                const lighthouseThresholds = LIGHTHOUSE_SNAPSHOT_THRESHOLDS;

                // And Lighthouse flow
                const flow = await LighthousePlaywrightFlow.startFlow('Airport addition journey', page);

                // And take snapshot helper to be passed to each page
                const takeLighthouseSnapshot: TakeLighthouseSnapshot = async (name) =>
                    await flow.snapshot(name, {
                        onlyCategories: Object.keys(lighthouseThresholds),
                        formFactor: 'mobile',
                    });

                // And countries list available on the system
                const countries: CountriesDto = [
                    {
                        id: 1,
                        name: 'test country name',
                        is_in_schengen: true,
                    },
                ];

                // And region to be selected during the test
                const regionToSelect: RegionDto = {
                    id: 1,
                    name: 'test region to select',
                };

                // And regions available on the system
                const regions: RegionsDto = [
                    regionToSelect,
                    {
                        id: 2,
                        name: 'test region not to select',
                    },
                ];

                // And new airport data
                const airport: AirportModel = {
                    name: 'test airport name',
                    iata: 'TES',
                    country_id: countries[0].id,
                    regions: [regionToSelect.id],
                    vaccination_notes: 'test vaccination notes',
                };

                // And mocks of api calls triggered during the test
                /**
                 * Note: countriesMock resolves with little bit of delay. This is to display the progress bar long enough to perform all snapshot audits.
                 */
                await countriesMock(page, countries, 200, 3000);
                await regionsMock(page, regions);
                await airportsMock(page, []);
                const postAirportMock = mockPostAirportsRequest(mockiavelli);

                // When I go to the main page
                await goTo(page, '/');

                // And I set expected color scheme
                await setDarkMode(page, darkMode);

                // Then the dark mode is set
                expect(assertDarkMode(page, darkMode)).toBeTruthy();

                // When I navigate to Add airport page
                await addAirportPage.navigateTo();

                // Then I see a progress bar
                await addAirportPage.assertProgressBarDisplay();

                // When I perform snapshot analysis for progress bar
                await addAirportPage.performSnapshotAnalysis('Progress bar', {takeLighthouseSnapshot});

                // Then I wait until the page is ready
                await addAirportPage.assertReady();

                // When I perform snapshot analysis for initial view
                await addAirportPage.performSnapshotAnalysis('Initial view', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // And I fulfill the form with correct data
                await addAirportPage.fulfillForm(airport, countries[0].name, regionToSelect.name);

                // Then I can see the form data is valid and Submit button is enabled
                await addAirportPage.assertSubmitEnabled();

                // When I perform snapshot analysis for provided data
                await addAirportPage.performSnapshotAnalysis('Form filled', {takeLighthouseSnapshot});

                // And I send data to the backend
                await addAirportPage.sendData();

                // And the POST endpoint resolves
                await postAirportMock.waitForRequest();

                // Then I can see successful addition confirmation
                await addAirportPage.assertAdditionConfirmationDisplay();

                // When I perform snapshot analysis for addition confirmation
                await addAirportPage.performSnapshotAnalysis('Airport added', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // Then I generate snapshot report
                await flow.generateReports(testInfo, 'lighthouse-test-add-airport-happy-path-flow.html', lighthouseThresholds);
            });

            test('Focusable elements', async ({page}, testInfo) => {
                /**
                 * This test focuses on focusable elements of the page, to assert their a11y contrasts.
                 */

                /**
                 * Focusable elements identified:
                 * - Link
                 * - Switch (Dark mode toggle)
                 * - TextField
                 * - Select
                 * - CheckboxGroup (focused as non-selected and selected)
                 * - TextArea
                 * - Button
                 */

                // Given categories and scores to achieve during Lighthouse audit
                const lighthouseThresholds = LIGHTHOUSE_SNAPSHOT_THRESHOLDS;

                // And Lighthouse flow
                const flow = await LighthousePlaywrightFlow.startFlow('Focused elements audit', page);

                // And take snapshot helper to be passed to each page
                const takeLighthouseSnapshot: TakeLighthouseSnapshot = async (name) =>
                    await flow.snapshot(name, {
                        onlyCategories: Object.keys(lighthouseThresholds),
                        formFactor: 'mobile',
                    });

                // And countries list available on the system
                const countries: CountriesDto = [
                    {
                        id: 1,
                        name: 'test country name',
                        is_in_schengen: true,
                    },
                ];

                // And region to be selected during the test
                const regionToSelect: RegionDto = {
                    id: 1,
                    name: 'test region to select',
                };

                // And regions available on the system
                const regions: RegionsDto = [regionToSelect];

                // And new airport data
                const airport: AirportModel = {
                    name: 'test airport name',
                    iata: 'TES',
                    country_id: countries[0].id,
                    regions: [regionToSelect.id],
                    vaccination_notes: 'test vaccination notes',
                };

                // And mocks of api calls triggered during the test
                await countriesMock(page, countries, 200, 3000);
                await regionsMock(page, regions);
                await airportsMock(page, []);

                // When I go to the main page
                await goTo(page, '/');

                // And I set expected color scheme
                await setDarkMode(page, darkMode);

                // Then the dark mode is set
                expect(assertDarkMode(page, darkMode)).toBeTruthy();

                // When I navigate to Add airport page
                await addAirportPage.navigateTo();

                // Then I see a progress bar
                await addAirportPage.assertProgressBarDisplay();

                // And I wait until the page is ready
                await addAirportPage.assertReady();

                // Element: Link
                // And I perform focused link snapshot analysis
                await addAirportPage.performFocusedLinkSnapshotAnalysis('Focused link', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // Element: Switch
                // And I perform focused toggle snapshot analysis
                await addAirportPage.performFocusedSwitchSnapshotAnalysis('Focused switch', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // Element: TextField
                // And I perform focused text field snapshot analysis
                await addAirportPage.performFocusedTextFieldSnapshotAnalysis('Focused text field', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // Element: Select
                // And I perform focused select snapshot analysis
                await addAirportPage.performFocusedSelectSnapshotAnalysis('Focused select input', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // Element: CheckboxGroup (all stages)
                // And I perform focused checkbox snapshot analysis
                await addAirportPage.performFocusedCheckboxGroupSnapshotAnalysis({
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // Element: TextArea
                // And I perform focused textarea snapshot analysis
                await addAirportPage.performFocusedTextAreaSnapshotAnalysis('Focused textarea', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // Element: Button
                // And I perform focused button snapshot analysis
                await addAirportPage.performFocusedButtonSnapshotAnalysis(
                    'Focused button',
                    {
                        data: airport,
                        country: countries[0].name,
                        region: regionToSelect.name,
                    },
                    {takeLighthouseSnapshot},
                );

                // Then I generate snapshot report
                await flow.generateReports(testInfo, 'lighthouse-test-focusable-elements-flow.html', lighthouseThresholds);
            });
        });
        test.describe('Negative path', () => {
            let mockiavelli: Mockiavelli;
            let addAirportPage: AddAirportPage;

            test.beforeEach(async ({page}, testInfo) => {
                const testSuite = 'Negative path';
                mockiavelli = await Mockiavelli.setup(page);
                addAirportPage = new AddAirportPage(page, testInfo, testSuite, darkMode);
            });

            /**
             * This test scenario produces 5 browser console entries due to failing api calls.
             * It's set by 3rd party dependency, so we just must align with it here.
             */
            test.describe('Tests producing expected 5 console entries', () => {
                test.use({consoleEntriesAmount: 5});

                test('Failing endpoints', async ({page}, testInfo) => {
                    /**
                     * This test focuses on analysing snapshots when api calls are failing. There are two such situation on the page:
                     * - when any GET endpoint is considered failed (initial and three consecutive api calls failed)
                     * - when POST endpoint fails
                     */
                    test.slow();

                    // Given categories and scores to achieve during Lighthouse audit
                    const lighthouseThresholds = LIGHTHOUSE_SNAPSHOT_THRESHOLDS;

                    // And Lighthouse flow
                    const flow = await LighthousePlaywrightFlow.startFlow('Airport addition with failing endpoints journey', page);

                    // And take snapshot helper to be passed to each page
                    const takeLighthouseSnapshot: TakeLighthouseSnapshot = async (name) =>
                        await flow.snapshot(name, {
                            onlyCategories: Object.keys(lighthouseThresholds),
                            formFactor: 'mobile',
                        });

                    // And countries list available on the system
                    const countries: CountriesDto = [
                        {
                            id: 1,
                            name: 'test country name',
                            is_in_schengen: true,
                        },
                    ];

                    // And region to be selected during the test
                    const regionToSelect: RegionDto = {
                        id: 1,
                        name: 'test region to select',
                    };

                    // And regions available on the system
                    const regions: RegionsDto = [
                        regionToSelect,
                        {
                            id: 2,
                            name: 'test region not to select',
                        },
                    ];

                    // And new airport data
                    const airport: AirportModel = {
                        name: 'test airport name',
                        iata: 'TES',
                        country_id: countries[0].id,
                        regions: [regionToSelect.id],
                        vaccination_notes: 'test vaccination notes',
                    };

                    // And mocks of api calls triggered during the test
                    /**
                     * Note: first attempt and three consecutive retries for any GET endpoint must fail in order to display Error component.
                     * Playwright mocking order is bottom up. It means the last mock definition is used. Once it fulfills,
                     * the first above is used instead. This is why failing mock for GET /regions api call is created below successful one.
                     */
                    await regionsMock(page, regions);
                    await regionsMock(page, regions, 500, 4);
                    await countriesMock(page, countries);
                    await airportsMock(page, []);
                    const postAirportMock = mockPostAirportsRequest(mockiavelli, 500);

                    // When I go to the main page
                    await goTo(page, '/');

                    // And I set expected color scheme
                    await setDarkMode(page, darkMode);

                    // Then the dark mode is set
                    expect(assertDarkMode(page, darkMode)).toBeTruthy();

                    // When I navigate to Add airport page
                    await addAirportPage.navigateTo();

                    // Then I see connectivity error
                    await addAirportPage.assertConnectivityError();

                    // When I perform snapshot analysis for connectivity error
                    await addAirportPage.performSnapshotAnalysis('Connectivity error', {takeLighthouseSnapshot});

                    // And I refetch data
                    await addAirportPage.refetchData();

                    // Then I can see the page is ready
                    await addAirportPage.assertReady();

                    // When I fulfill the form with correct data
                    await addAirportPage.fulfillForm(airport, countries[0].name, regionToSelect.name);

                    // And I send data to the backend
                    await addAirportPage.sendData();

                    // And the POST endpoint resolves
                    await postAirportMock.waitForRequest();

                    // Then I can see failed addition confirmation
                    await addAirportPage.assertAdditionErrorDisplay();

                    // When I perform snapshot analysis for addition confirmation
                    await addAirportPage.performSnapshotAnalysis('Airport adding error', {
                        takeLighthouseSnapshot,
                    });

                    // Then I generate snapshot report
                    await flow.generateReports(
                        testInfo,
                        'lighthouse-test-add-airport-negative-path-failing-endpoints-journey-flow.html',
                        lighthouseThresholds,
                    );
                });
            });

            test('Form validation', async ({page}, testInfo) => {
                /**
                 * This test focuses on analysing snapshot of a form with each field containing invalid data.
                 * Error content does not really matter here, as the a11y tree for each error message is same.
                 * This is why I just put a 'space' char into text field and clear it afterward, to make to field empty.
                 */

                test.slow();

                // Given categories and scores to achieve during Lighthouse audit
                const lighthouseThresholds = LIGHTHOUSE_SNAPSHOT_THRESHOLDS;

                // And Lighthouse flow
                const flow = await LighthousePlaywrightFlow.startFlow('Airport addition with validation errors journey', page);

                // And take snapshot helper to be passed to each page
                const takeLighthouseSnapshot: TakeLighthouseSnapshot = async (name) =>
                    await flow.snapshot(name, {
                        onlyCategories: Object.keys(lighthouseThresholds),
                        formFactor: 'mobile',
                    });

                // And countries list available on the system
                const countries: CountriesDto = [
                    {
                        id: 1,
                        name: 'test country name',
                        is_in_schengen: true,
                    },
                ];

                // And region to be selected for a moment during the test
                const regionToSelect: RegionDto = {
                    id: 1,
                    name: 'test region to select',
                };

                // And regions available on the system
                const regions: RegionsDto = [regionToSelect];

                // And mocks of api calls triggered during the test
                await regionsMock(page, regions);
                await countriesMock(page, countries);
                await airportsMock(page, []);

                // When I go to the main page
                await goTo(page, '/');

                // And I set expected color scheme
                await setDarkMode(page, darkMode);

                // Then the dark mode is set
                expect(assertDarkMode(page, darkMode)).toBeTruthy();

                // When I navigate to Add airport page
                await addAirportPage.navigateTo();

                // Then I can see form being ready
                await addAirportPage.assertReady();

                // When I trigger validation errors on entire form
                await addAirportPage.fulfillFormIncorrectly();

                // Then I perform snapshot analysis for validation display
                await addAirportPage.performSnapshotAnalysis('Validation errors', {
                    takeLighthouseSnapshot,
                    skipAxeViolationChecks: true,
                });

                // And I generate snapshot report
                await flow.generateReports(
                    testInfo,
                    'lighthouse-test-add-airport-negative-path-form-validation-journey-flow.html',
                    lighthouseThresholds,
                );
            });
        });
    });
}
