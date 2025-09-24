import {Page} from '@playwright/test';
import {assertDarkMode} from './assertions';

export const goTo = async (page: Page, url: string) => {
    await page.goto(url);
};

export const setDarkMode = async (page: Page, darkMode: boolean) => {
    if (!(await assertDarkMode(page, darkMode))) {
        await page.getByRole('switch', {name: /dark mode/i}).click();
    }
};
