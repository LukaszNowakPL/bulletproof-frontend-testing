import {AssertSnapshotConfig, SnapshotPage} from './SnapshotPage';
import {Page, TestInfo, expect} from '@playwright/test';
import {assertHeaderContent, assertIsOn} from '../../playwright/assertions';
import {AirportModel} from '../../../src/api/rest/airports.dto';

export class AddAirportPage extends SnapshotPage {
    public constructor(page: Page, testInfo: TestInfo, testSuite: string, darkMode: boolean) {
        super(page, testInfo, 'Add airport', testSuite, darkMode);
    }

    public async navigateTo() {
        await this.page.getByRole('link', {name: /add airport/i}).click();
    }

    public async assertProgressBarDisplay() {
        await expect(this.page.getByRole('progressbar', {name: /fetching data/i})).toBeVisible();
    }

    public async assertReady() {
        await assertIsOn(this.page, 'airports/add');
        await assertHeaderContent(this.page, /add airport/i);
    }

    public async fulfillForm(data: AirportModel, country: string, region: string) {
        await this.page.getByRole('textbox', {name: /name/i}).fill(data.name);
        await this.page.getByRole('textbox', {name: /iata code/i}).fill(data.iata);
        await this.page.getByRole('combobox', {name: /country/i}).click();
        await this.page.getByRole('option', {name: country}).click();
        await this.page.getByRole('checkbox', {name: region}).click();
        await this.page.getByRole('textbox', {name: /vaccination notes/i}).fill(data.vaccination_notes as string);
    }

    public async assertSubmitEnabled() {
        await expect(this.page.getByRole('button', {name: /submit/i})).toBeEnabled();
    }

    public async sendData() {
        await this.page.getByRole('button', {name: /submit/i}).click();
    }

    public assertAdditionConfirmationDisplay = async () => {
        await expect(this.page.getByRole('status')).toBeVisible();
        await expect(this.page.getByText(/airport added successfully/i)).toBeVisible();
    };

    public assertConnectivityError = async () => {
        await expect(this.page.getByRole('alert')).toBeVisible();
        await expect(this.page.getByText(/sorry, there is some connectivity error/i)).toBeVisible();
    };

    public refetchData = async () => {
        await this.page.getByRole('button', {name: /restart data fetching/i}).click();
    };

    public assertAdditionErrorDisplay = async () => {
        await expect(this.page.getByRole('status')).toBeVisible();
        await expect(this.page.getByText(/error while adding an airport/i)).toBeVisible();
    };

    public async fulfillFormIncorrectly() {
        await this.page.getByRole('textbox', {name: /name/i}).fill(' ');
        await this.page.getByRole('textbox', {name: /name/i}).clear();

        await this.page.getByRole('textbox', {name: /iata code/i}).fill(' ');
        await this.page.getByRole('textbox', {name: /iata code/i}).clear();

        await this.page.getByRole('checkbox').first().click();
        await this.page.getByRole('checkbox').first().click();
    }

    public async performSnapshotAnalysis(snapshotTitle: string, config: AssertSnapshotConfig) {
        await this.assertSnapshots(snapshotTitle, config);
    }

    public async performFocusedLinkSnapshotAnalysis(snapshotTitle: string, config: AssertSnapshotConfig) {
        await this.page.getByRole('link', {name: /add airport/i}).focus();
        await this.assertSnapshots(snapshotTitle, config);
    }

    public async performFocusedSwitchSnapshotAnalysis(snapshotTitle: string, config: AssertSnapshotConfig) {
        await this.page.getByRole('switch', {name: /dark mode/i}).focus();
        await this.assertSnapshots(snapshotTitle, config);
    }

    public async performFocusedTextFieldSnapshotAnalysis(snapshotTitle: string, config: AssertSnapshotConfig) {
        await this.page.getByRole('textbox', {name: /name/i}).focus();
        await this.assertSnapshots(snapshotTitle, config);
    }

    public async performFocusedSelectSnapshotAnalysis(snapshotTitle: string, config: AssertSnapshotConfig) {
        await this.page.getByRole('combobox', {name: /country/i}).focus();
        await this.assertSnapshots(snapshotTitle, config);
    }

    public async performFocusedCheckboxGroupSnapshotAnalysis(config: AssertSnapshotConfig) {
        // Focus on non-checked checkbox
        await this.page.getByRole('textbox', {name: /regions/i}).focus();
        await this.page.press('body', 'Tab');
        await this.assertSnapshots('Focused non-checked checkbox group', config);

        // Focus on checked checkbox
        await this.page.press('body', 'Space');
        await this.page.press('body', 'Shift+Tab');
        await this.page.press('body', 'Tab');
        await this.assertSnapshots('Focused checked checkbox group', config);

        // Uncheck the checkbox
        await this.page.press('body', 'Space');
    }

    public async performFocusedTextAreaSnapshotAnalysis(snapshotTitle: string, config: AssertSnapshotConfig) {
        await this.page.getByRole('textbox', {name: /vaccination notes/i}).focus();
        await this.assertSnapshots(snapshotTitle, config);
    }

    public async performFocusedButtonSnapshotAnalysis(
        snapshotTitle: string,
        airportData: {data: AirportModel; country: string; region: string},
        config: AssertSnapshotConfig,
    ) {
        // Filling the form
        await this.fulfillForm(airportData.data, airportData.country, airportData.region);

        // Focus on Submit button
        await this.page.press('body', 'Tab');
        await this.assertSnapshots(snapshotTitle, config);
    }
}
