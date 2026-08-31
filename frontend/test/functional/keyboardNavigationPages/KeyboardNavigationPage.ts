import {Locator, Page, expect} from '@playwright/test';

export class KeyboardNavigationPage {
    protected readonly page: Page;

    private static readonly KEYS = {
        navigateToPrevElement: 'Shift+Tab',
        navigateToNextElement: 'Tab',
        navigateToPrevGroupElement: 'ArrowUp',
        navigateToNextGroupElement: 'ArrowDown',
        select: 'Space',
        activate: 'Enter',
    };

    public constructor(page: Page) {
        this.page = page;
    }

    private getFocusedElement() {
        return this.page.locator(':focus') as NotClickableLocator;
    }

    public async navigateToPrevElement() {
        await this.page.keyboard.press(KeyboardNavigationPage.KEYS.navigateToPrevElement);
    }

    public async navigateToNextElement() {
        await this.page.keyboard.press(KeyboardNavigationPage.KEYS.navigateToNextElement);
    }

    public async navigateToPrevGroupElement() {
        await this.page.keyboard.press(KeyboardNavigationPage.KEYS.navigateToPrevGroupElement);
    }

    public async navigateToNextGroupElement() {
        await this.page.keyboard.press(KeyboardNavigationPage.KEYS.navigateToNextGroupElement);
    }

    public async activateFocusedElement() {
        await this.page.keyboard.press(KeyboardNavigationPage.KEYS.activate);
    }

    public async fill(value: string) {
        await this.getFocusedElement().fill(value);
    }

    public async selectFocusedElement() {
        await this.page.keyboard.press(KeyboardNavigationPage.KEYS.select);
    }

    public async assertFocusedElement(expectedElement: Locator) {
        await expect(expectedElement).toBeFocused()
    }

    public async assertFocusedElementHasText(text: string | RegExp) {
        await expect(this.getFocusedElement()).toHaveText(text);
    }

    public async assertFocusedElementHasValue(value: string | RegExp) {
        await expect(this.getFocusedElement()).toHaveValue(value);
    }

    public async assertNoFocus() {
        await expect(this.getFocusedElement()).toHaveCount(0);
    }
}

type NotClickableLocator = Locator & {
    click: never;
    check: never;
    dblclick: never;
    dragTo: never;
    hover: never;
    setChecked: never;
    tap: never;
    uncheck: never;
};
