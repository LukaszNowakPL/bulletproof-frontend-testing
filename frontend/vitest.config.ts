/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

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
        environment: 'jsdom',
        sequence: {shuffle: true},
        fileParallelism: true,
        restoreMocks: true,
        setupFiles: [
            './test/integration/tests-env/polyfills.ts',
            './test/integration/tests-env/setupTest.ts',
            './test/integration/tests-env/itExtend.ts',
        ],
        projects: [
            {
                extends: true,
                test: {
                    name: 'jsdom',
                    include: [jsdomInclude],
                },
            },
            {
                extends: true,
                test: {
                    name: 'future-browser',
                    include: ['test/integration/test-scenarios/**/*.test.ts?(x)'],
                    exclude: [jsdomInclude],
                },
            },
        ],
    },
});
