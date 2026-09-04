import {it as itBase} from 'vitest';
import {worker} from '../mocks/browser.js';

type Worker = typeof worker;

export const it = itBase.extend<{
    worker: Worker;
}>({
    worker: [
        // eslint-disable-next-line no-empty-pattern
        async ({}, use) => {
            // Start the worker before the test.
            await worker.start();

            // Expose the worker object on the test's context.
            await use(worker);

            // Remove any request handlers added in individual test cases.
            // This prevents them from affecting unrelated tests.
            worker.resetHandlers();
        },
        {
            auto: true,
        },
    ],
});
