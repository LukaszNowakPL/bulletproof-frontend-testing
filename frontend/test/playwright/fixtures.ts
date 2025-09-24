// @ts-ignore
import {test as base, expect} from '@playwright/test';
export {expect} from '@playwright/test';
import type {
    ConsoleMessage,
    PlaywrightTestOptions,
    PlaywrightWorkerOptions,
    TestType,
    PlaywrightTestArgs,
    PlaywrightWorkerArgs,
} from 'playwright/types/test';
import {Mockiavelli} from 'mockiavelli';

// This pattern assures type safety of test extension provided by the fixture
const typedTestObject: TestType<PlaywrightTestArgs & PlaywrightTestOptions, PlaywrightWorkerArgs & PlaywrightWorkerOptions> = base;

type TestExtendOptions = {
    consoleEntriesAmount?: number;
};

export const test = typedTestObject.extend<TestExtendOptions, {page: void}>({
    consoleEntriesAmount: [0, {option: true}],

    page: async ({page, consoleEntriesAmount}, use) => {
        /**
         * Fixture for catching all console entries and failing if anything is printed.
         * Based on https://github.com/microsoft/playwright/issues/27277
         */
        // Catching console items
        const consoleEntries: string[] = [];
        page.on('console', (m: ConsoleMessage) => consoleEntries.push(m.location().url));

        // Attaching Mockiavelli to generate console entry once no mock for triggered api call is created
        await Mockiavelli.setup(page);

        // Performing normal test
        await use(page);

        // Asserting there is expected amount of console entries
        // We expect them to be 0 by default, however, negative path scenarios with failing api calls contain some entries produced by 3rd party dependency.
        expect(consoleEntries).toHaveLength(consoleEntriesAmount || 0);
    },
});
