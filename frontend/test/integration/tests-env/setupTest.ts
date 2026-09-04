import '@testing-library/jest-dom';
import {configure} from '@testing-library/react';
import failOnConsole from 'vitest-fail-on-console';

/**
 * Fails vitest tests if any tested component will produce a console entry. Such functionality helps keep the console clean.
 */
failOnConsole();

configure({testIdAttribute: 'data-test-id'});
