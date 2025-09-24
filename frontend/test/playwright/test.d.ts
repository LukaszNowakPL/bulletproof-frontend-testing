declare module '@playwright/test' {
    export {defineConfig, devices, expect} from 'playwright/types/test';
    export type {Page, Locator, TestInfo, BrowserContext, CDPSession, PlaywrightTestProject} from 'playwright/types/test';
}
