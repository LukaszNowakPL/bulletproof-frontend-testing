import {it as itBase} from 'vitest';
import {server} from '../mocks/server';

type Server = typeof server;

export const it = itBase.extend<{
    server: Server;
}>({
    server: [
        async (_, use) => {
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
