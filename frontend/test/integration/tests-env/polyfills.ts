/**
 * This polyfill is related with Radix ui implementation and the Jsdom env Vitest tests. It should not apply to Browser mode tests.
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
