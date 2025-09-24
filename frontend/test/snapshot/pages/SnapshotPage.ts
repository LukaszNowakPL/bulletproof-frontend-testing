import {Page, TestInfo, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {slugify} from '../utils/helpers';
import {TakeLighthouseSnapshot} from '../types';
import {ARIA_SNAPSHOTS_DIRECTORY, VISUAL_SNAPSHOTS_DIRECTORY} from '../utils/const';

export class SnapshotPage {
    page: Page;
    testInfo: TestInfo;
    pageTitle: string;
    testSuite: string;
    darkMode: boolean;

    public constructor(page: Page, testInfo: TestInfo, pageTitle: string, testSuite: string, darkMode: boolean) {
        this.page = page;
        this.testInfo = testInfo;
        this.pageTitle = pageTitle;
        this.testSuite = testSuite;
        this.darkMode = darkMode;
    }

    // A bucket for sub-functions performing dedicated static code analysis.
    public async assertSnapshots(snapshotTitle: string, config?: AssertSnapshotConfig) {
        await Promise.all([
            this.assertAxeChecks(snapshotTitle, Boolean(config?.skipAxeViolationChecks)),
            this.performVisualSnapshotComparison(snapshotTitle),
            this.performAriaSnapshotComparison(snapshotTitle),
            config?.takeLighthouseSnapshot !== undefined && this.assertLighthouseSnapshot(snapshotTitle, config.takeLighthouseSnapshot),
        ]);
    }

    // Performs Axe analysis for accessibility
    private async assertAxeChecks(snapshotTitle: string, skipViolationChecks: boolean) {
        const axeChecks = await new AxeBuilder({page: this.page})
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze();

        await this.testInfo.attach(this.composeA11yReportName(snapshotTitle), {
            body: JSON.stringify(axeChecks, null, 2),
            contentType: 'application/json',
        });

        if (!skipViolationChecks) {
            expect(axeChecks.violations).toEqual([]);
        }
    }

    private composeA11yReportName(snapshotTitle: string) {
        return slugify(`${this.pageTitle} ${this.testSuite} ${snapshotTitle}${this.darkMode ? ' dark mode' : ''} a11y`);
    }

    // Performs automatic Lighthouse analysis
    private async assertLighthouseSnapshot(snapshotTitle: string, takeSnapshot: TakeLighthouseSnapshot) {
        await takeSnapshot(this.composeLighthouseSnapshotName(snapshotTitle));
    }

    // Performs visual snapshot comparison (regression)
    private async performVisualSnapshotComparison(snapshotTitle: string) {
        await this.page.mouse.move(0, 0);

        await expect(this.page).toHaveScreenshot([VISUAL_SNAPSHOTS_DIRECTORY, `${this.composeSnapshotName(snapshotTitle)}.png`], {
            fullPage: true,
            maxDiffPixelRatio: 0,
        });
    }

    // Performs accessibility tree regression (comparison of yaml representations of a11y trees)
    private async performAriaSnapshotComparison(snapshotTitle: string) {
        expect(await this.page.locator('body').ariaSnapshot()).toMatchSnapshot([
            ARIA_SNAPSHOTS_DIRECTORY,
            `${this.composeSnapshotName(snapshotTitle)}.yml`,
        ]);
    }

    private composeSnapshotName(snapshotTitle: string) {
        return slugify(`${this.pageTitle} ${this.testSuite} ${snapshotTitle}${this.darkMode ? ' dark mode' : ''}`);
    }

    private composeLighthouseSnapshotName(snapshotTitle: string) {
        return slugify(`${this.pageTitle} / ${snapshotTitle}${this.darkMode ? ' / dark mode' : ''}`);
    }
}

export interface AssertSnapshotConfig {
    takeLighthouseSnapshot: TakeLighthouseSnapshot;
    skipAxeViolationChecks?: true;
}
