declare global {
    const page: import('puppeteer').Page;
    const browser: import('puppeteer').Browser;
    const context: import('puppeteer').BrowserContext;

    const describe: (name: string, fn: () => void) => void;
    const beforeAll: (fn: () => Promise<void> | void) => void;
    const afterAll: (fn: () => Promise<void> | void) => void;
    const beforeEach: (fn: () => Promise<void> | void) => void;
    const afterEach: (fn: () => Promise<void> | void) => void;
    const test: (name: string, fn: (done?: jest.DoneCallback) => Promise<void> | void, timeout?: number) => void;
    const expect: jest.Expect;
}

export {};
