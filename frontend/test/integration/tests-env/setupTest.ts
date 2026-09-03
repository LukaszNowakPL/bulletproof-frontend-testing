import '@testing-library/jest-dom';
import {configure} from '@testing-library/react';
import failOnConsole from 'vitest-fail-on-console';
import {vi} from 'vitest';

/**
 * Fails vitest tests if any tested component will produce a console entry. Such functionality helps keep the console clean.
 */
failOnConsole();

configure({testIdAttribute: 'data-test-id'});

// Required by radix-ui components used on tested view.
beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
});
