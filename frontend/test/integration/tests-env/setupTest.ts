import failOnConsole from 'vitest-fail-on-console';

/**
 * Fails vitest tests if any tested component will produce a console entry. Such functionality helps keep the console clean.
 */
failOnConsole();
