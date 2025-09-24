import {PlaywrightApi} from './playwright-api';
import {DockerApi} from './docker-api';

export class ChromeContainer {
    IMAGE_NAME = '';
    playwrightApi: PlaywrightApi;
    dockerApi: DockerApi;

    constructor() {
        this.playwrightApi = new PlaywrightApi(DockerApi.axiosInstance);
        this.IMAGE_NAME = `mcr.microsoft.com/${this.playwrightApi.getImageName()}`;
        this.dockerApi = new DockerApi(this.IMAGE_NAME);
    }

    async start() {
        const chromeImage = await this.dockerApi.findImage();

        /** Chrome image not found, pull it then **/
        if (!chromeImage) {
            console.log(`Chrome image not found, pulling ${this.IMAGE_NAME}`);
            await this.dockerApi.pullImage();
        }

        if (await this.dockerApi.findContainer()) {
            console.log('Reusing existing chrome.');
            const status = await this.dockerApi.getContainerStatus();
            console.log(`Container status: ${status}`);

            if (status === 'exited') {
                await this.playwrightApi.sendPlaywrightCoreToContainer(this.dockerApi.CHROME_CONTAINER_NAME);
                await this.dockerApi.startContainer();
                await this.dockerApi.waitForChromeToBeUp(this.playwrightApi.getDockerBrowserUpLog());
            }
        } else {
            await this.dockerApi.createContainer(this.playwrightApi.getRunCommand());
            await this.playwrightApi.sendPlaywrightCoreToContainer(this.dockerApi.CHROME_CONTAINER_NAME);

            await this.dockerApi.startContainer();
            await this.dockerApi.waitForChromeToBeUp(this.playwrightApi.getDockerBrowserUpLog());
        }
    }

    async teardown() {
        await this.dockerApi.stopAndRemoveContainer();
    }
}
