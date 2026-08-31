import {KeyboardNavigationPage} from './KeyboardNavigationPage';
import {expect, Page} from '@playwright/test';
import {assertHeaderContent, assertIsOn} from '../../playwright/assertions';
import {AirportModel} from '../../../src/api/rest/airports.dto';

export class AddAirportPage extends KeyboardNavigationPage {
    public constructor(page: Page) {
        super(page);
    }

    private nameField = this.page.getByRole('textbox', {name: /name/i});
    private iataField = this.page.getByRole('textbox', {name: /iata code/i});
    private countryField = this.page.getByRole('combobox', {name: /country/i});
    private getOptionField = (name: string | RegExp) => this.page.getByRole('option', {name});
    private getRegionCheckbox = (name: string | RegExp) => this.page.getByRole('checkbox', {name});
    private vaccinationField = this.page.getByRole('textbox', {name: /vaccination notes/i});
    private submitButton = this.page.getByRole('button', {name: /submit/i});

    public async assertReady() {
        await assertIsOn(this.page, 'airports/add');
        await assertHeaderContent(this.page, /add airport/i);
    }

    public async proceedThroughHeader() {
        // Note: No 'Skip to main content' functionality is available, so we must go through entire section manually
        await this.navigateToNextElement();
        await this.assertFocusedElement(this.page.getByRole('link', {name: /airports dashboard/i}));
        await this.navigateToNextElement();
        await this.assertFocusedElement(this.page.getByRole('link', {name: 'Airports', exact: true}));
        await this.navigateToNextElement();
        await this.assertFocusedElement(this.page.getByRole('link', {name: /add airport/i}));
        await this.navigateToNextElement();
        await this.assertFocusedElement(this.page.getByRole('switch', {name: /dark mode/i}));
        await this.navigateToNextElement();
    }

    public async proceedThroughForm(airport: AirportModel, countryName: string, regionToSelect: string) {
        await this.assertFocusedElement(this.nameField);
        await this.fill(airport.name);
        await this.navigateToNextElement();

        await this.assertFocusedElement(this.iataField);
        await this.fill(airport.iata);
        await this.navigateToNextElement();

        await this.assertFocusedElement(this.countryField);
        await this.activateFocusedElement();
        await this.assertFocusedElement(this.getOptionField(countryName));
        await this.activateFocusedElement();
        await this.assertFocusedElement(this.countryField);
        await this.navigateToNextElement();

        await this.fill(regionToSelect);
        await this.navigateToNextElement();
        await this.assertFocusedElement(this.getRegionCheckbox(regionToSelect));
        await this.selectFocusedElement();
        await this.navigateToNextElement();

        await this.assertFocusedElement(this.vaccinationField);
        await this.fill(airport.vaccination_notes!);
        await this.navigateToNextElement();
    }

    public async submitForm() {
        await this.assertFocusedElement(this.submitButton);
        await this.activateFocusedElement();
    }

    public async proceedThroughPage(airport: AirportModel, countryName: string, regionToSelect: string) {
        await this.assertNoFocus();
        await this.proceedThroughHeader();
        await this.proceedThroughForm(airport, countryName, regionToSelect);
        await this.submitForm();
    }

    public assertAdditionConfirmation = async () => {
        await expect(this.page.getByText(/airport added successfully/i)).toBeVisible();
    };
}
