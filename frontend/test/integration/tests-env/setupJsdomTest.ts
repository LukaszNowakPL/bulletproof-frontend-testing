import '@testing-library/jest-dom';
import {vi} from 'vitest';

// Required by radix-ui components used on tested view.
beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
});
