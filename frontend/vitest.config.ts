/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';

const jsdomInclude = 'test/integration/test-scenarios/jsdom/**/*.test.ts?(x)';

export default defineConfig({
    plugins: [react()],
    test: {
        outputFile: {
            junit: './reports/integration.xml',
        },
        coverage: {
            provider: 'istanbul',
            reporter: ['lcov'],
            include: ['src'],
        },
        reporters: ['verbose', 'junit'],
        clearMocks: true,
        globals: true,
        sequence: {shuffle: true},
        fileParallelism: true,
        restoreMocks: true,
        setupFiles: ['./test/integration/tests-env/setupTest.ts'],
        projects: [
            {
                extends: true,
                test: {
                    name: 'jsdom',
                    include: [jsdomInclude],
                    environment: 'jsdom',
                },
            },
            {
                extends: true,
                test: {
                    name: 'future-browser',
                    include: ['test/integration/test-scenarios/**/*.test.ts?(x)'],
                    exclude: [jsdomInclude],
                    setupFiles: ['./test/integration/tests-env/itExtend.ts'],
                    browser: {
                        enabled: true,
                        // headless: true,
                        provider: playwright(),
                        instances: [{browser: 'chromium'}],
                    },
                },
            },
        ],
    },
});
