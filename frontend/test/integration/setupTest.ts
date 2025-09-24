import '@testing-library/jest-dom';
import {configure} from '@testing-library/react';
import {server} from './mocks/server';
import failOnConsole from 'vitest-fail-on-console';

/**
 * Fails vitest tests if any tested component will produce a console entry. Such functionality helps keep the console clean.
 */
failOnConsole();

configure({testIdAttribute: 'data-test-id'});

/**
 * Api mocking by MSW before all tests.
 * onUnhandledRequest configuration prints console error if there is any unexpected api call triggered.
 */
beforeAll(() =>
    server.listen({
        onUnhandledRequest({method, url}) {
            console.error('Found an unhandled %s request to %s', method, url);
        },
    }),
);

// Reset any request handlers to not affect other tests
afterEach(() => server.resetHandlers());

// Clean up after tests are done
afterAll(() => server.close());
