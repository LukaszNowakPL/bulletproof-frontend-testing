import {ChromeContainer} from './chrome-container';

async function globalSetup() {
    await new ChromeContainer().start();
}

export default globalSetup;
