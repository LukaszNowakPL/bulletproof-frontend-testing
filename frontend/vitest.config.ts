/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        outputFile: './reports/test-report.xml',
        coverage: {
            provider: 'istanbul',
            reporter: ['lcov'],
            include: ['src'],
        },
        reporters: ['verbose', 'junit'],
        clearMocks: true,
        include: ['test/integration/**/*.test.ts?(x)'],
        globals: true,
        environment: 'jsdom',
        sequence: {shuffle: true},
        fileParallelism: true,
        setupFiles: ['./test/integration/polyfills.ts', './test/integration/setupTest.ts', './test/integration/itExtend.ts'],
    },
});
