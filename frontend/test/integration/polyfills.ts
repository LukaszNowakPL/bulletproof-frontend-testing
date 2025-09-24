/**
 * This polyfill is related with Radix ui implementation and the fact that Vitest tests use Jsdom instead of browser environment.
 * Taken from https://github.com/joaom00/radix-select-vitest/blob/main/src/HoverCard.test.tsx
 * Based on discussion https://github.com/radix-ui/primitives/issues/2002
 */
global.ResizeObserver = class ResizeObserver {
    cb: any;
    constructor(cb: any) {
        this.cb = cb;
    }
    observe() {
        this.cb([{borderBoxSize: {inlineSize: 0, blockSize: 0}}]);
    }
    unobserve() {}
    disconnect() {}
} as any;
