import {ChromeContainer} from './chrome-container';

async function globalTeardown() {
    await new ChromeContainer().teardown();
}

export default globalTeardown;
