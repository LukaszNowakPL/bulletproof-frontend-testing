import {it as itBase} from 'vitest';
import {server} from '../mocks/server';

/**
 * @ToDo: Remove this file.
 * This extension is temporary solution only for the migration process.
 * The assumed pattern is that Jsdom tests should rather assert some sort of direct integration than perform assertions connected with some interactions.
 * Therefore it probable will not need to mock any api calls, making MSW integration redundant. This way, the whole extension should be available only for browser tests in the future.
 */

type Server = typeof server;

export const it = itBase.extend<{
    server: Server;
}>({
    server: [
        // eslint-disable-next-line no-empty-pattern
        async ({}, use) => {
            /**
             * onUnhandledRequest configuration prints console error if there is any unexpected api call triggered.
             */
            server.listen({
                onUnhandledRequest({method, url}) {
                    console.error('Found an unhandled %s request to %s', method, url);
                },
            });

            // Expose the server object on the test's context.
            await use(server);

            // Cleanup request handlers added in individual test cases to prevent them affecting unrelated tests.
            server.resetHandlers();
            server.close();
        },
        {
            auto: true,
        },
    ],
});
