import {expect, Locator, Page} from '@playwright/test';
import {assertHeaderContent, assertIsOn} from '../../playwright/assertions';

export class AddAirportPage {
    page: Page;
    nameField: Locator;
    iataCodeField: Locator;
    countryField: Locator;
    vaccinationField: Locator;
    submitButton: Locator;

    public constructor(page: Page) {
        this.page = page;

        this.nameField = this.page.getByRole('textbox', {name: /name/i});
        this.iataCodeField = this.page.getByRole('textbox', {name: /iata code/i});
        this.countryField = this.page.getByRole('combobox', {name: /country/i});
        this.vaccinationField = this.page.getByRole('textbox', {name: /vaccination notes/i});
        this.submitButton = this.page.getByRole('button', {name: /submit/i});
    }

    private getOptionField = (name: string | RegExp) => this.page.getByRole('option', {name});
    private getRegionCheckbox = (name: string | RegExp) => this.page.getByRole('checkbox', {name});

    public async assertReady() {
        await assertIsOn(this.page, 'airports/add');
        await assertHeaderContent(this.page, /add airport/i);
    }

    public async fillNameField(data: string) {
        await this.nameField.fill(data);
    }

    public async triggerNameFieldValidation() {
        await this.fillNameField('test data');
        await this.nameField.clear();
    }

    public async triggerIataCodeFieldValidation() {
        await this.fillIataCodeField('AAA');
        await this.iataCodeField.clear();
    }

    public async fillIataCodeField(data: string) {
        await this.iataCodeField.fill(data);
    }

    public async clearIataCodeField() {
        await this.iataCodeField.clear();
    }

    public async selectCountry(countryName: string) {
        await this.countryField.click();
        await this.getOptionField(countryName).click();
    }

    public async checkRegion(regionName: string) {
        await this.getRegionCheckbox(regionName).click();
    }

    public async fillVaccinationNotesField(data: string) {
        await this.vaccinationField.fill(data);
    }

    public async clickSubmitButton() {
        await this.submitButton.click();
    }

    public assertAdditionConfirmationDisplay = async () => {
        const status = this.page.getByRole('status');
        await expect(status).toBeVisible();
        await expect(status).toHaveText(/airport added successfully/i);
    };

    public assertAdditionErrorDisplay = async () => {
        const status = this.page.getByRole('status');
        await expect(status).toBeVisible();
        await expect(status).toHaveText(/error while adding an airport/i);
    };

    public assertNoValidationErrors = async () => {
        await expect(this.page.getByRole('alert')).toHaveCount(0);
        await expect(this.submitButton).toBeEnabled();
    };

    public assertValidationError = async (errorMessage: string | RegExp) => {
        await expect(this.page.getByRole('alert')).toBeVisible();
        await expect(this.page.getByText(errorMessage)).toBeVisible();

        await expect(this.submitButton).toBeDisabled();
    };
}
